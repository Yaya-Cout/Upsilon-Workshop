import { v4 as uuidv4 } from 'uuid';
import { Project } from './types';

var projects: Project[] | null = null

async function getData() {
    if (projects == null) {
        const data = await fetch('/src/data.json').then((response) => response.json());
        //@ts-ignore
        projects = shuffle(data).map(e => { return { title: e.title, author: e.author, description: e.description, rating: 2, uuid: uuidv4(), files: [{ title: e.title, content: e.content }] }; });
    } return projects;
}

// Copied from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array: any[]) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}
export default getData