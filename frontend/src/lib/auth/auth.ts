import type { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { writable } from 'svelte/store';

interface AuthGuardType {
	signIn: (username: string, password: string) => Promise<CognitoUserSession>;
	getCurrentUser: () => Promise<CognitoUser | Error>;
	initIsLogged: () => Promise<boolean>;
	logout: () => Promise<void>;
	getToken: () => Promise<string>;
}

export const isLogged = writable<boolean>(false);

export function getIsLogged() {
	let val;
	isLogged.subscribe(currentValue => val = currentValue);
	return val;
}

export function authGuard(): AuthGuardType {
	const signIn = async (username: string, password: string) => {
		return Auth.signIn(username, password);
	};

	const getCurrentUser = async () => {
		const user = await Auth.currentAuthenticatedUser({
			bypassCache: false,
		});
		return user;
	};

	const initIsLogged = async () => {
		try {
			await Auth.currentSession();
			isLogged.update((state) => (true));
			return true;
		} catch (e) {
			isLogged.update((state) => (false));
			return false;
		}
	};

	const logout = async () => {
		return Auth.signOut();
	};

	const getToken = async () => {
		return new Promise<string>((resolve, reject) => {
			Auth.currentSession()
				.then((session) => {
					isLogged.update((state) => (true));
					resolve(session.getIdToken().getJwtToken());
				})
				.catch((err) => {
					// show alert
					console.log('getTokenError', err);
					isLogged.update((state) => (false));
					/* 
						TODO
						NotAuthorizedException: Refresh Token has expired
								at http://localhost:5173/node_modules/.vite/deps/aws-amplify.js?v=66de3d28:96427:19
					*/
					reject(err);
				});
		});
	};

	return { signIn, getCurrentUser, initIsLogged, logout, getToken };
}
