import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		heroImage: z.string(),
        tags: z.array(z.string()),
	}),
});

const projects = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        status: z.enum(['Active', 'Inactive', 'Complete']),
		weight: z.number(),
		heroImage: z.string(),
        url: z.string().url(),
        tags: z.array(z.string()),
    }),
})

export const collections = {
    posts,
    projects
};