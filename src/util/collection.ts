import { getCollection } from 'astro:content';

export async function loadAndFormatCollection(name: any) {
    const posts = await getCollection(name);

    posts.forEach((post: any) => {
        const date = new Date(post.data.pubDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const monthZerofilled = (month < 10 ? '0' : '') + month;

        post.relativePath = `${year}/${monthZerofilled}/${post.slug}/`;
        post.absolutePath = `/posts/${post.relativePath}`;
    });

    return posts;
};

export async function getTags(posts: any[]) {
    const tags = posts.map(post => post.data.tags).flat();
    return Array.from(new Set(tags)).sort();
}