# Upsilon Workshop

Server Status:
![Server Status](https://healthchecks.io/badge/120fbda1-0064-4090-9de9-8e5d979e84bf/OTdARQCd-2/Server.svg)

Global Server Status (including the backups and the disk checks):
![Global Server Status](https://healthchecks.io/badge/120fbda1-0064-4090-9de9-8e5d979e84bf/0qNkKR3z-2.svg)

Upsilon Workshop is a free software project that aims to provide a complete
collaborative platform to create Python projects for the Numworks calculator.

## Features

- [x] Autocompletion in the editor
- [x] Syntax highlighting in the editor
- [x] Monaco editor (VSCode editor)
- [x] Searching for projects
- [x] Tagging projects
- [x] Markdown support in project description
- [x] View project size before uploading
- [x] Private projects
- [x] Collaborative projects (no real-time editing)
- [x] Manage calculator storage
- [x] Copyleft license (AGPLv3) for the server and the frontend
- [ ] Project cloning
- [ ] CLI to interact with the server directly from the shell (existant but not
      longer maintained)

## Development

To setup the project, run the following commands:

```bash
./download-epsilon-js.sh
yarn install
```

To start the server, run the following command:

```bash
yarn start
```

Once the server is started, you can access it at http://localhost:5173. It won't
work if the port is different because of the CORS policy of the server.

## Contributing

Contributions are welcome! Feel free to open an issue or a pull request.

If you have any question, don't hesitate to create an issue.
Alternatively, you can go to the [Discord server](https://discord.gg/JpmjSH3) on
the `#dev-workshop` channel.

## License

This project is licensed under the AGPLv3 license. See the [LICENSE](LICENSE)
file for more details.
