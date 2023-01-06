export type Project = {
    title: String,
    rating: number,
    description: String,
    author: String,
    files: Script[],
    uuid: String,
}
export type Script = {
    title: string,
    content: string,
}