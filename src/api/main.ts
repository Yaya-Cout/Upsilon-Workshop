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
        // Debugging
        // this.TOKEN = "xxxxxxxxxxxxxxxx";
        // this.BASE_URL = "http://localhost:8000/"
        // this.BASE_URL = "http://127.0.0.1:8000/"
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
    async _request(endpoint: string, method: string, body: object, expectedStatus: number = 200): Promise<any> {
        if (!this.isLoggedIn()) {
            throw new Error("Not logged in");
        }

        const response = await fetch(
            this.BASE_URL + endpoint,
            {
                method: method,
                body: JSON.stringify(body),
                headers: {
                    "Authorization": "Token " + this.TOKEN,
                    "Content-Type": "application/json",
                }
            });
        if (response.status !== expectedStatus) {
            throw new Error("API request failed");
        }

        return await response.json()
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
}
