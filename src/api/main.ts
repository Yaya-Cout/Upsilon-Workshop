import { Project, Script, User, Group, Tag } from "../types";

/*
 * Class to interact with the Workshop API
 *
 * @class API
 */
export default class API extends EventTarget {
    BASE_URL: string;
    NOT_LOGGED_IN_ERROR: boolean = false;
    LOGGED_IN: boolean = false;
    USERNAME: string = "";
    READY: boolean = false;
    EMPTY_PROJECT: Project = {
        title: "",
        rating: 0,
        short_description: "",
        long_description: "",
        author: "",
        files: [],
        uuid: "",
        isPublic: false,
        language: "",
        tags: [],
        created: new Date(),
        modified: new Date(),
        views: 0,
        version: "",
        _loaded: false,
        _loading: false,
    };

    /*
     * Initialize the API client
     */
    constructor() {
        super()

        this.BASE_URL = "https://yann.n1n1.xyz/"

        // Update user info
        this.updateUserInfo()
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

        const json = await response.json()

        if (json["token"] === undefined) {
            throw new Error("Token not found")
        }

        this.setToken(json["token"])

        this.updateUserInfo()

        return json["user"]["username"]
    }

    /*
     * Logout of the API
     * @returns {Promise} - A promise that resolves to true if the logout was successful
     */
    async logout(): Promise<boolean> {
        console.log("Logging out")
        // Check if the token is present
        if (!this.isLoggedIn()) {
            console.warn("Tried to log out when not logged in");
            return true;
        }

        // Invalidate the token on the server
        try {
            await this._request("api/auth/logout/", "POST", {}, 204)
        } catch (e) {
            console.error("Failed to invalidate token on server");
        }

        // Remove the token
        this.setToken("")

        this.LOGGED_IN = false;

        return true;
    }

    /*
     * Get the token of the user
     * @returns {string} - The token of the user
     */
    getToken(): string {
        return localStorage.getItem("token") || "";
    }

    /*
     * Set the token of the user
     * @param {string} token - The token of the user
     */
    setToken(token: string): void {
        if (token === "") {
            localStorage.removeItem("token")
            this.LOGGED_IN = false;
            return;
        } else {
            this.LOGGED_IN = true;
        }
        localStorage.setItem("token", token);
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
    async _request(endpoint: string, method: string, body: object, expectedStatus: number = 200, loginRequired: boolean = true, skipReady: boolean = false): Promise<any> {
        // If the login is required, wait for the API to be ready
        if (!this.READY && !skipReady) {
            // Wait for the event to be emitted
            await new Promise<void>((resolve) => {
                this.addEventListener("ready", () => {
                    resolve()
                })
            })
        }

        if (!this.isLoggedIn() && loginRequired) {
            this.NOT_LOGGED_IN_ERROR = true;
            throw new Error("Not logged in");
        }

        const payload = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "" as string,
            },
            body: undefined as any | undefined,
        }
        if (this.isLoggedIn()) {
            payload.headers["Authorization"] = "Token " + this.getToken()
        }

        if (method !== "GET" && method !== "HEAD") {
            payload.body = JSON.stringify(body)
        }

        const response = await fetch(this.BASE_URL + endpoint, payload)

        if (response.status !== expectedStatus && expectedStatus !== 0) {
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
        const response = await this._request(
            "scripts/" + (query !== "" ? "?search=" + query : ""),
            "GET", {}, 200, false
        )

        // Convert the response to a list of projects
        const projects: Project[] = []
        for (const project of response.results) {
            // Convert the files
            const files: Script[] = []
            for (const file of project["files"]) {
                files.push({
                    title: file["name"],
                    content: file["content"],
                })
            }

            projects.push({
                title: project["name"],
                rating: 3.5,
                short_description: project["short_description"],
                long_description: project["long_description"],
                author: project["author"].split("/").slice(-2)[0],
                files: files,
                uuid: project["id"],
                isPublic: project["is_public"],
                language: project["language"],
                tags: [],
                created: new Date(project["created"]),
                modified: new Date(project["updated"]),
                views: project["views"],
                version: project["version"],
                _loaded: true,
                _loading: false,
            })

            // Convert the tags
            for (const tag of project["tags"]) {
                projects[projects.length - 1].tags.push(this.getTag(tag.split("/").at(-2)))
            }
        }

        return projects
    }

    /* Delete a project from the API
     * @param {Project} project - The project to delete
     * @returns {Promise} - A promise that resolves to true if the project was deleted
     * @throws {Error} - If the project could not be deleted/the user is not the owner
     */
    async deleteProject(project: Project): Promise<boolean> {
        await this._request("scripts/" + project.uuid + "/", "DELETE", {}, 204)
        return true
    }

    /*
     * Create a project on the API
     * @param {Project} project - The project to create
     * @returns {Promise} - A promise that resolves to the UUID of the project
     */
    async createProject(project: Project): Promise<string> {
        // Convert the files
        const files: object[] = []
        for (const file of project.files) {
            files.push({
                name: file.title,
                content: file.content,
            })
        }

        // Create the project
        const response = await this._request("scripts/", "POST", {
            name: project.title,
            short_description: project.short_description,
            long_description: project.long_description,
            files: files,
            is_public: project.isPublic,
            language: project.language,
            version: project.version,
            // TODO: Add tags
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

        // TODO: Remove the extension from the name and add a capital letter at
        // the start of the name and set the title to that

        // Create the project
        return await this.createProject({
            title: name,
            short_description: "",
            long_description: "",
            language: language,
            files: [{
                title: name,
                content: content,
            }],
            isPublic: false,
            rating: 3.5,
            author: this.USERNAME,
            tags: [],
            created: new Date(),
            modified: new Date(),
            uuid: "",
            views: 0,
            version: "1.0.0",
            _loaded: true,
            _loading: false,
        })
    }

    /*
     * Update a project on the API
     * @param {Project} project - The project to update
     * @returns {Promise} - A promise that resolves to the response
     * @throws {Error} - If an error occurred
     */
    async updateProject(project: Project): Promise<object> {
        // Convert the files
        const files: object[] = []
        for (const file of project.files) {
            files.push({
                name: file.title,
                content: file.content,
            })
        }

        // Update the project
        return await this._request("scripts/" + project.uuid + "/", "PUT", {
            name: project.title,
            short_description: project.short_description,
            long_description: project.long_description,
            files: files,
            is_public: project.isPublic,
            language: project.language,
            // TODO: Add tags
            version: project.version,
        }, 200, true)
    }

    /*
     * Update a project's metadata on the API
     * @param {Project} project - The project to update
     * @returns {Promise} - A promise that resolves to the response
     * @throws {Error} - If an error occurred
     */
    async updateProjectMetadata(project: Project): Promise<object> {
        // Update the project
        return await this._request("scripts/" + project.uuid + "/", "PATCH", {
            name: project.title,
            short_description: project.short_description,
            long_description: project.long_description,
            is_public: project.isPublic,
            version: project.version,
            language: project.language,
        }, 200, true)
    }

    /*
     * Register a user on the API
     * @param {string} username - The username of the user
     * @param {string} password - The password of the user
     * @param {string} email - The email of the user
     * @returns {Promise} - A promise that resolves to request status (boolean)
     *                      and response (json)
     * @throws {Error} - If the username is already taken
     */
    async register(username: string, password: string, email: string): Promise<{ success: boolean, response: object }> {
        const response = await this._request("register/", "POST", {
            username: username,
            password: password,
            email: email,
        }, 0, false)

        // Check if the request was successful
        if (response === undefined) {
            throw new Error("API request failed");
        }

        if (!response["username"] || response["username"] !== username) {
            return {
                success: false,
                response: response,
            }
        }
        return {
            success: true,
            response: response,
        }
    }

    /*
     * Update user information on the API
     * @returns {Promise} - A promise that resolves when the request is done
     */
    async updateUserInfo(): Promise<void> {
        if (!this.isLoggedIn()) {
            this.LOGGED_IN = false
            this.USERNAME = ""
        } else {
            try {
                const response = await this._request("current_user/", "GET", {}, 200, false, true)
                this.LOGGED_IN = true
                this.USERNAME = response["username"]
            } catch (e) {
                this.logout()
                // TODO: Better error handling
            }
        }

        console.log("User info updated")

        // Mark the API as initialized
        this.READY = true

        // Notify that the API is ready
        this.dispatchEvent(new CustomEvent("ready"))
    }


    /*
     * Return a lasy-loaded user
     * @param {string} username - The username of the user
     * @returns {User} - The user
     * @throws {Error} - If the user does not exist
     */
    getUser(username: string): User {
        return this.getLazy("_getUser", username)
    }


    /*
     * Get an user from the API (internal)
     * @param {string} username - The username of the user
     * @returns {Promise} - A promise that resolves to the user
     * @throws {Error} - If the user does not exist
     */
    async _getUser(username: string): Promise<User> {
        const response = await this._request("users/" + username + "/", "GET", {}, 200, false)

        // Convert the response to a user
        const user: User = {
            username: response["username"],
            projects: [],
            groups: [],
            collaborations: [],
            ratings: response["ratings"],
            _loaded: true,
            _loading: false,
        }

        // Convert the projects
        for (const project of response["scripts"]) {
            const projectId = project.split("/").at(-2)
            user.projects.push(this.getProject(projectId))
        }

        // Convert the collaborations
        for (const project of response["collaborations"]) {
            const projectId = project.split("/").at(-2)
            user.collaborations.push(this.getProject(projectId))
        }


        // Convert the groups
        for (const group of response["groups"]) {
            const groupId = parseInt(group.split("/").at(-2))
            user.groups.push(this.getGroup(groupId))
        }

        return user
    }

    /*
     * Return a lasy-loaded group object
     * @param {number} id - The ID of the group
     * @returns {Proxy} - A proxy that fetches the group data from the API when
     *                    needed
     * @throws {Error} - If the group does not exist
     */
    getGroup(id: number): Group {
        return this.getLazy("_getGroup", id)
    }

    /*
     * Get a group from the API (internal)
     * @param {number} id - The ID of the group
     * @returns {Promise} - A promise that resolves to the group
     * @throws {Error} - If the group does not exist
     * @private
     */
    async _getGroup(id: number): Promise<Group> {
        const response = await this._request("groups/" + id + "/", "GET", {}, 200, false)

        // Convert the user set
        const userSet: User[] = []
        for (const user of response["user_set"]) {
            const username = user.split("/").at(-2)
            userSet.push(this.getUser(username))
        }

        // Convert the response to a group
        const group: Group = {
            id: response["url"].split("/").at(-2),
            url: response["url"],
            name: response["name"],
            user_set: userSet,
            _loaded: true,
            _loading: false,
        }

        return group
    }

    /*
     * Return a lasy-loaded project object
     * @param {uuid} uuid - The UUID of the project
     * @returns {Proxy} - A proxy that fetches the project data from the API
     *                    when needed
     * @throws {Error} - If the project does not exist
     */
    getProject(uuid: string): Project {
        return this.getLazy("_getProject", uuid)
    }

    /*
     * Get a project from the API (internal)
     * @param {string} uuid - The UUID of the project
     * @returns {Promise} - A promise that resolves to the project
     * @throws {Error} - If the project does not exist
     */
    async _getProject(uuid: string): Promise<Project> {
        const response = await this._request("scripts/" + uuid + "/", "GET", {}, 200, false)

        // Convert the files
        const files: Script[] = []
        for (const file of response["files"]) {
            files.push({
                title: file["name"],
                content: file["content"],
            })
        }

        // Convert the response to a project
        const project: Project = {
            title: response["name"],
            // TODO: Get the rating (requires a new field in the API or a
            // computation on the client)
            rating: 3.5,
            short_description: response["short_description"],
            long_description: response["long_description"],
            author: response["author"].split("/").slice(-2)[0],
            files: files,
            uuid: response["id"],
            isPublic: response["is_public"],
            language: response["language"],
            tags: [],
            created: new Date(response["created"]),
            modified: new Date(response["modified"]),
            views: response["views"],
            version: response["version"],
            _loaded: true,
            _loading: false,
        }

        // Convert the tags
        for (const tag of response["tags"]) {
            project.tags.push(this.getTag(tag.split("/").at(-2)))
        }

        return project
    }

    /*
     * Get a tag from the API
     * @param {string} name - The name of the tag
     * @returns {Promise} - A promise that resolves to the tag
     * @throws {Error} - If the tag does not exist
     */
    getTag(name: string): Tag {
        return this.getLazy("_getTag", name)
    }

    /*
     * Get a tag from the API (internal)
     * @param {string} name - The name of the tag
     * @returns {Promise} - A promise that resolves to the tag
     * @throws {Error} - If the tag does not exist
     */
    async _getTag(name: string): Promise<Tag> {
        const response = await this._request("tags/" + name + "/", "GET", {}, 200, false)

        // Convert the response to a tag
        const tag: Tag = {
            name: response["name"],
            description: response["short_description"],
            projects: [],
            _loaded: true,
            _loading: false,
        }

        // Convert the projects
        for (const project of response["script_set"]) {
            const projectId = project.split("/").at(-2)
            tag.projects.push(this.getProject(projectId))
        }


        return tag
    }

    /*
     * Return an object that is lasy-loaded from another function
     * @param {string} func - The name of the function to call
     * @param {...any} args - The arguments to pass to the function
     * @returns {Proxy} - A proxy that calls the function when needed
     */
    getLazy(func: string, ...args: any[]): any {
        // Create the proxy
        return new Proxy({
            _loaded: false,
            _loading: false,
        } as any, {
            get: async (target, prop) => {
                // Check if the target is loaded
                if (target._loaded) {
                    // Return the property
                    return target[prop]
                }

                // If not, check if the target is loading
                if (target._loading) {
                    // Wait for the target to load
                    await new Promise<void>((resolve) => {
                        const interval = setInterval(() => {
                            if (target._loaded) {
                                clearInterval(interval)
                                resolve()
                            }
                        }, 100)
                    })

                    // Return the property
                    return target[prop]
                }

                // If not, load the target
                target._loading = true

                // Call the function
                // @ts-ignore - This have to be a valid function
                const result = await this[func](...args)

                // Store the result for every property
                for (const prop of Object.keys(result)) {
                    target[prop] = result[prop]
                }

                // Mark the target as loaded
                target._loaded = true
                target._loading = false

                // Return the property
                return target[prop]
            }
        })
    }

    /*
     * Load a lazy-loaded object
     * @param {Proxy} obj - The object to load
     * @returns {Promise} - A promise that resolves when the object is loaded
     */
    async loadLazyLoadingObject(obj: any): Promise<any> {
        // Wait for the object to load
        const objLoaded = {}

        // Force the object to load
        // await obj._loading
        await obj._loaded

        // Iterate over each property
        for (const prop of Object.keys(await obj)) {
            // Get the property
            const value = await obj[prop]
            // @ts-ignore - This is a valid assignment, but TypeScript does not
            //              recognize it
            objLoaded[prop] = await value
        }


        return objLoaded
    }


}

