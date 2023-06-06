import {
	PUBLIC_GITHUB_USERNAME,
	PUBLIC_BASE_URL,
	PUBLIC_GITHUB_PROFILE,
  PUBLIC_LINKEDIN_USERNAME,
  PUBLIC_LINKEDIN_PROFILE,
  PUBLIC_TWITTER_USERNAME,
  PUBLIC_TWITTER_PROFILE
} from '$env/static/public';

const website = {
	author: 'Matteo Depascale',
	ogLanguage: 'en_US',
	siteLanguage: 'en-US',
	siteTitle: 'CloudNature',
	siteShortTitle: 'CloudNature',
	description:
		'CloudNature Blog - Get all the info you need about Cloud',
	siteUrl: PUBLIC_BASE_URL,
	keywords: ['cloud', 'aws', 'serverless', 'programming', 'coding'],
	backgroundColor: '#1b1b1b',
	themeColor: '#ffa31a',
	githubPage: PUBLIC_GITHUB_USERNAME,
	linkedinProfile: PUBLIC_LINKEDIN_PROFILE,
	twitterUsername: PUBLIC_TWITTER_USERNAME,
	twitterUserId: PUBLIC_TWITTER_PROFILE
};

export { website as default };
