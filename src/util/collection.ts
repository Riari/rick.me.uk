import { getCollection } from 'astro:content';

export async function loadAndFormatCollection(name) {
	const posts = await getCollection(name);

    posts.forEach(post => {
        const date = new Date(post.data.pubDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const monthZerofilled = (month < 10 ? '0' : '') + month;

        post.slug = `${year}/${monthZerofilled}/${post.slug}`;
        post.tags = post.data.tags;
    });

    return posts;
};

export async function getTags(posts) {
    const tags = posts.map(post => post.data.tags).flat();
    return Array.from(new Set(tags)).sort();
}