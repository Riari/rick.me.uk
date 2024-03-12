import { getCollection } from 'astro:content';

export async function loadAndFormatCollection(name) {
	const posts = await getCollection(name);

    posts.forEach(post => {
        const date = new Date(post.data.pubDate);
        const year = date.getFullYear();
        const month = (date.getMonth() < 10 ? '0' : '') + date.getMonth();

        post.slug = `${year}/${month}/${post.slug}`;
        post.tags = post.data.tags;
    });

    return posts;
};

export async function getTags(posts) {
    const tags = posts.map(post => post.data.tags).flat();
    return Array.from(new Set(tags)).sort();
}