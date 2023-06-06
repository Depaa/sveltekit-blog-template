export interface Sitemap {
	xml: string;
	parent: Item[];
	text?: string;
}

export interface Item {
	name: string;
	attrs?: { [key: string]: string }[];
	text?: string | number;
	children?: Item[];
}
