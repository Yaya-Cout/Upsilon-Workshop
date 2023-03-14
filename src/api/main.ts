import { Project, Script } from "./types";

/*
 * Class to interact with the Workshop API
 *
 * @class API
 */
export default class API {
    BASE_URL: string;
    TOKEN: string | undefined;
    /*
     * Initialize the API client
     */
    constructor() {
        this.BASE_URL = "https://django-cdqivkhudi9mmk5gqgb0.apps.playground.napptive.dev/";
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

        this.TOKEN = json["token"]

        return json["user"]["username"]
    }

    /*
     * Get if the user is logged in
     * @returns {boolean} - True if the user is logged in, false otherwise
     */
    isLoggedIn(): boolean {
        // TODO: Check if the token is valid using the API
        return this.TOKEN !== undefined;
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
            throw new Error("Not logged in");
        }

        let payload = {
            method: method,
            headers: {
                "Content-Type": "application/json",
            }
        }
        if (this.isLoggedIn()) {
            payload.headers["Authorization"] = "Token " + this.TOKEN
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
        this.TOKEN = undefined;

        return true;
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
        }

        return project
    }
}
