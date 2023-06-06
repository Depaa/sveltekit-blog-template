interface Seo {
	title: string;
	description: string;
	tags: string[];
}
export default interface UpdateBlogPost {
	slug?: string;
	title: string;
	description: string;
	image?: string;
	featured?: string;
	tags: string[];
	content: string;
	contentMd: string;
	seo?: Seo;
}
