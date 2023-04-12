export type Project = {
    title: string,
    rating: number,
    description: string,
    author: string,
    files: Script[],
    uuid: string,
    isPublic: boolean,
    language: string,
}
export type Script = {
    title: string,
    content: string,
}