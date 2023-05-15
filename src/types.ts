// A workshop project is a project that is created by a user and that can be
// shared with other users. It is composed of a list of scripts and a title.
export type Project = {
    // The name of the project
    title: string,
    // The rating of the project
    // TODO: This is not implemented and is going to be reimplemented using
    // likes
    rating: number,
    // The description of the project
    // TODO: Add a short description field too
    description: string,
    // The author of the project
    // TODO: Precise the type of this field
    author: string,
    // The list of files in the project as Script objects
    files: Script[],
    // The UUID of the project
    uuid: string,
    // Whether the project is public or not
    isPublic: boolean,
    // The language of the project (python, xcas, etc.)
    language: string,
}

// A script is a file in a project. It is composed of a title and a content.
export type Script = {

    title: string,
    content: string,
}

// A group is a group of users. It is composed of a list of users and a name.
export type Group = {
    // The url of the group
    url: string,
    // The id of the group (extracted from the url)
    id: number,
    // The name of the group
    name: string,
    // List of users in the group
    user_set: User[],

    // Internal field to know if the group is loaded or not
    _loaded: boolean,
    // Internal field to know if the group is loading or not
    _loading: boolean,
}

// An user is a user of the website. It is composed of a username, a list of
// groups and a list of projects.
export type User = {
    // The username of the user
    username: string,
    // The list of groups the user is in
    groups: Group[],
    // The list of projects the user has created
    projects: Project[],
    // The list of projects the user has contributed to
    collaborations: Project[],
    // The list of ratings the user has given
    // TODO: This is not implemented and is going to be reimplemented using
    // likes
    ratings: []

    // Internal field to know if the user is loaded or not
    _loaded: boolean,
    // Internal field to know if the user is loading or not
    _loading: boolean,
}
