
export interface SitemapImage {
    caption: string,
    loc: string
    title: string
};

export interface SitemapPost {
    loc: string,
    lastmod: string,
    changefreq: string,
    priority: number,
};

export interface SitemapItem {
    post: SitemapPost,
    image?: SitemapImage
};
