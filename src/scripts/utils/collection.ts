import { getCollection } from 'astro:content';
import { ProjectType } from "../../content/config";
import { Accent } from "../types";

export async function loadAndFormatCollection(name: any, withDate = true) {
	const collection = await getCollection(name)

    collection.forEach((item: any) => {
        if (withDate) {
            const date = new Date(item.data.pubDate)
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const monthZerofilled = (month < 10 ? '0' : '') + month

            item.relativeURL = `${year}/${monthZerofilled}/${item.id}/`
        } else {
            item.relativeURL = `${item.id}/`
        }

        item.absoluteURL = `/${name}/${item.relativeURL}`
    })

    return collection
};

export async function getTags(collection: any[]) {
    const tags = collection.map(item => item.data.tags).flat()
    return Array.from(new Set(tags)).sort()
}

export function projectTypeToAccent(type: string) {
    switch (type) {
        case ProjectType.Game:
            return Accent.One
        case ProjectType.Tool:
            return Accent.Two
        case ProjectType.Package:
            return Accent.Three
        case ProjectType.Website:
            return Accent.Four
        default:
            return Accent.One
    }
}