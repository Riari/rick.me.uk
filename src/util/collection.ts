import { getCollection } from 'astro:content';

export async function loadAndFormatCollection(name: any, withDate = true) {
	const collection = await getCollection(name);

    collection.forEach((item: any) => {
        if (withDate) {
            const date = new Date(item.data.pubDate);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const monthZerofilled = (month < 10 ? '0' : '') + month;
    
            item.relativeURL = `${year}/${monthZerofilled}/${item.slug}/`;
        } else {
            item.relativeURL = `${item.slug}/`;
        }

        item.absoluteURL = `/${name}/${item.relativeURL}`;
    });

    return collection;
};

export async function getTags(collection: any[]) {
    const tags = collection.map(item => item.data.tags).flat();
    return Array.from(new Set(tags)).sort();
}