import { PUBLIC_BASE_URL } from '$env/static/public';
import { listPosts } from "$lib/services/posts";
import type { Post } from "$lib/types/BlogPost";
import type { SitemapImage, SitemapItem, SitemapPost } from "$lib/types/Sitemap.js";


const render = (posts: SitemapItem[]) => {
    let sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
    xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:pagemap="http://www.google.com/schemas/sitemap-pagemap/1.0" 
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>dev.cloudnature.net</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>dev.cloudnature.net/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    posts.forEach(el => {
        sitemap += `<url>
        <loc>${el.post.loc}</loc>
        <lastmod>${el.post.lastmod}</lastmod>
        <changefreq>${el.post.changefreq}</changefreq>
        <priority>${el.post.priority}</priority>`;

        if (el.image) {
            sitemap +=
                `<image:image>
                <image:caption>${el.image.caption}</image:caption>
                <image:loc>${el.image.loc}</image:loc>
                <image:title>${el.image.title}</image:title>
                </image:image>`;
        }
        sitemap += "</url>";
    }

    );

    sitemap += "</urlset>";
    return sitemap
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
    const posts: SitemapItem[] = [];
    let hasMore = true;
    let nextToken;
    try {
        if (hasMore) {
            const fetchedPosts = ({ ...(await listPosts(fetch, '', 100)) });
            nextToken = fetchedPosts.nextToken;
            hasMore = !!nextToken;
            fetchedPosts.items.forEach((post: Post) => {
                const postItem: SitemapPost = {
                    loc: `${PUBLIC_BASE_URL}/blog/${post.slug}`,
                    lastmod: new Date().toISOString(),
                    changefreq: 'weekly',
                    priority: 0.8
                };
                if (post.image) {
                    const postImage: SitemapImage = {
                        caption: 'Cover Image',
                        loc: post.image,
                        title: 'Cover Image'
                    }
                    const sitemapItem: SitemapItem = {
                        post: postItem,
                        image: postImage
                    };
                    posts.push(sitemapItem);

                } else {
                    const sitemapItem: SitemapItem = {
                        post: postItem,
                    };
                    posts.push(sitemapItem);
                };
            });
        }
        const response = new Response(render(posts))
        response.headers.set('Content-Type', 'application/xml');
        return response;
    } catch (error) {
        console.error(error);
    }
};