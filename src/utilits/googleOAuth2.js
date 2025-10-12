import { OAuth2Client } from 'google-auth-library';
import path from 'node:path';
import { readFile } from 'fs/promises';

import { getEnvVar } from './getEnvVar.js';
import createHttpError from 'http-errors';


const PATH_JSON = path.json(process.cwd(), 'google-oauth.json');
const oauthConfig = JSON.parse(await readFile(PATH_JSON));
const googleOAuthClient = new OAuth2Client({
    client_id: getEnvVar('GOOGLE_AUTH_CLIENT_ID'),
    client_secret: getEnvVar('GOOGLE_AUTH_CLIENT_SECRET'),
    redirectUri: oauthConfig.web.redirect_uris[0],
});
export const generateAuthUrl = () => googleOAuthClient.generateAuthUrl({
    scope: [
           'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ]
})

export const validateCode = async (code) => {
    const res = await googleOAuthClient.getToken(code);
    if (!res.tokens.id_token) throw createHttpError(401, 'Unauthorized');
    const ticket = await googleOAuthClient.verifyIdToken({
        idToken: res.tokens.id_token,
    });
    return ticket;
}

export const getFullNameFromGoogleTokenPayload = (payload) => {
    let fullName = 'Guest';
    if (payload.given_name && payload.family_name) {
        fullName = `${payload.given_name} ${payload.family_name}`;
    }
    else if (payload.given_name) {
        fullName = payload.given_name;
    }
    return fullName;
}