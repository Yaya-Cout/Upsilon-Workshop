import { Project, Script } from "../types";

/*
 * Class to interact with the Workshop API
 *
 * @class API
 */
export default class API {
    BASE_URL: string;
    NOT_LOGGED_IN_ERROR: boolean = false;
    LOGGED_IN: boolean = false;

    /*
     * Initialize the API client
     */
    constructor() {
        this.BASE_URL = "https://django-cdqivkhudi9mmk5gqgb0.apps.playground.napptive.dev/";

        // Check if the user is logged in
        if (this.isLoggedIn()) {
            // TODO: Check if the token is valid using the API
            this.LOGGED_IN = true;
        }
    }

    /*
     * Login to the API
     * @param {string} username - The username of the user
     * @param {string} password - The password of the user
     * @returns {Promise} - A promise that resolves to the user's username
     */
    async login(username: string, password: string): Promise<string> {
        const response = await fetch(
            this.BASE_URL + "api/auth/login/",
            {
                method: "POST",

                headers: {
                    'Authorization': 'Basic ' + window.btoa(username + ":" + password),
                    "Content-Type": "application/json",
                },
            });
        if (response.status !== 200) {
            throw new Error("Invalid credentials");
        }

        let json = await response.json()

        if (json["token"] === undefined) {
            throw new Error("Token not found")
        }

        this.setToken(json["token"])

        return json["user"]["username"]
    }

    /*
     * Logout of the API
     * @returns {Promise} - A promise that resolves to true if the logout was successful
     */
    async logout(): Promise<boolean> {
        // Check if the token is present
        if (!this.isLoggedIn()) {
            console.warn("Tried to log out when not logged in");
            return true;
        }

        // Invalidate the token on the server
        await this._request("api/auth/logout/", "POST", {}, 204)

        // Remove the token
        this.setToken("")
        return true;
    }

    /*
     * Get the token of the user
     * @returns {string} - The token of the user
     */
    getToken(): string {
        return sessionStorage.getItem("token") || "";
    }

    /*
     * Set the token of the user
     * @param {string} token - The token of the user
     */
    setToken(token: string): void {
        if (token === "") {
            sessionStorage.removeItem("token")
            this.LOGGED_IN = false;
            return;
        } else {
            this.LOGGED_IN = true;
        }
        sessionStorage.setItem("token", token);
    }

    /*
     * Get if the user is logged in
     * @returns {boolean} - True if the user is logged in, false otherwise
     */
    isLoggedIn(): boolean {
        // TODO: Check if the token is valid using the API
        if (this.getToken() === "") {
            this.LOGGED_IN = false;
        } else {
            this.LOGGED_IN = true;
        }
        return this.LOGGED_IN;
    }

    /*
     * Make an authenticated request to the API (if the user is logged in)
     * @param {string} endpoint - The endpoint to make the request to
     * @param {string} method - The HTTP method to use
     * @param {object} body - The body of the request
     * @returns {Promise} - A promise that resolves to the response
     */
    async _request(endpoint: string, method: string, body: object, expectedStatus: number = 200, loginRequired: boolean = true): Promise<any> {
        if (!this.isLoggedIn() && loginRequired) {
            this.NOT_LOGGED_IN_ERROR = true;
            throw new Error("Not logged in");
        }

        let payload = {
            method: method,
            headers: {
                "Content-Type": "application/json",
            }
        }
        if (this.isLoggedIn()) {
            payload.headers["Authorization"] = "Token " + this.getToken()
        }

        if (method !== "GET" && method !== "HEAD") {
            payload.body = JSON.stringify(body)
        }

        const response = await fetch(this.BASE_URL + endpoint, payload)

        if (response.status !== expectedStatus) {
            throw new Error("API request failed");
        }

        try {
            return await response.json()
        }
        catch (e) {
            return undefined
        }
    }

    /*
     * Get projects from the API
     * @param {string} query - The query to search for (optional)
     * @returns {Promise} - A promise that resolves to the projects
     */
    async getProjects(
        query: string = "",
    ): Promise<Project[]> {
        let response = await this._request(
            "scripts/" + (query !== "" ? "?search=" + query : ""),
            "GET", {}, 200, false
        )

        // Convert the response to a list of projects
        let projects: Project[] = []
        for (let project of response.results) {
            // Convert the files
            let files: Script[] = []
            for (let file of project["files"]) {
                files.push({
                    title: file["name"],
                    content: file["content"],
                })
            }

            projects.push({
                title: project["name"],
                rating: 3.5,
                description: project["description"],
                author: project["author"].split("/").slice(-2)[0],
                files: files,
                uuid: project["id"],
                isPublic: project["is_public"],
                language: project["language"],
            })
        }

        return projects
    }

    /*
     * Get a project from the API
     * @param {string} uuid - The UUID of the project
     * @returns {Promise} - A promise that resolves to the project
     * @throws {Error} - If the project does not exist
     */
    async getProject(uuid: string): Promise<Project> {
        let response = await this._request("scripts/" + uuid + "/", "GET", {}, 200, false)

        // Convert the files
        let files: Script[] = []
        for (let file of response["files"]) {
            files.push({
                title: file["name"],
                content: file["content"],
            })
        }

        // Convert the response to a project
        let project: Project = {
            title: response["name"],
            // TODO: Get the rating (requires a new field in the API or a
            // computation on the client)
            rating: 3.5,
            description: response["description"],
            author: response["author"].split("/").slice(-2)[0],
            files: files,
            uuid: response["id"],
            isPublic: response["is_public"],
            language: response["language"],
        }

        return project
    }

    /*
     * Create a project on the API
     * @param {Project} project - The project to create
     * @returns {Promise} - A promise that resolves to the UUID of the project
     */
    async createProject(project: Project): Promise<string> {
        // Convert the files
        let files: object[] = []
        for (let file of project.files) {
            files.push({
                name: file.title,
                content: file.content,
            })
        }

        // Create the project
        let response = await this._request("scripts/", "POST", {
            name: project.title,
            description: project.description,
            files: files,
            is_public: project.isPublic,
            language: project.language,
        }, 201, true)

        return response["id"]
    }

    /*
     * Create an one-file project on the API
     * @param {string} name - The name of the project (same as the file)
     * @param {string} content - The content of the file
     * @returns {Promise} - A promise that resolves to the UUID of the project
     */
    async createOneFileProject(name: string, content: string): Promise<string> {
        // Get the language of the file
        let language;
        if (name.endsWith(".py")) {
            language = "python";
        } else if (name.endsWith(".xw")) {
            language = "xcas";
        } else {
            console.warn("Unknown file extension");
            language = "python";
        }

        // Create the project
        return await this.createProject({
            title: name,
            description: "",
            language: language,
            files: [{
                title: name,
                content: content,
            }],
            isPublic: false,
        })
    }
}
