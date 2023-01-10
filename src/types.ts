export type Project = {
    title: string,
    rating: number,
    description: string,
    author: string,
    files: Script[],
    uuid: string,
}
export type Script = {
    title: string,
    content: string,
}