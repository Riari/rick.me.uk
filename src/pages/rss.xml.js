import rss from "@astrojs/rss";

import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
import { loadAndFormatCollection } from "../scripts/utils/collection";

export async function GET(context) {
    const posts = (await loadAndFormatCollection('posts'))
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    return rss({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: context.site,
        items: posts.map((post) => ({
            ...post.data,
            link: post.absoluteURL,
        })),
    });
}
