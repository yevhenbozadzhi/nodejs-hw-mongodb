import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import createHttpError from "http-errors";
import { usersSchemaCollection } from "../db/models/user.js"
import bcrypt from 'bcrypt';
import { sessionSchemaCollection } from "../db/models/session.js";
import { randomBytes } from "crypto";
import { FIFTEEN_MINUTES, SMTP, TEMPLATES_DIR, THIRTY_DAYS  } from "../constants/index.js";
import jwt from "jsonwebtoken";
import { getEnvVar } from '../utilits/getEnvVar.js';
import { sendEmail } from "../utilits/sendMail.js";

export const registerUser = async (payload) => {
    const user = await usersSchemaCollection.findOne({
        email: payload.email,
    });
    if (user) throw createHttpError(409, 'Email in use');
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    return await usersSchemaCollection.create({
        ...payload,
        password: encryptedPassword,
    });
};


export const loginUser = async (payload) => {
    const user = await usersSchemaCollection.findOne({
        email: payload.email,
    });
    if (!user) {
        throw createHttpError(401, 'User not found');
    }
    const isEqual = await bcrypt.compare(payload.password, user.password);
    if (!isEqual) {
        throw createHttpError(401, 'Unauthorized');
    }

    await sessionSchemaCollection.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await sessionSchemaCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    });
};

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),

    };
};


export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    const session = await sessionSchemaCollection.findOne({
        _id: sessionId,
        refreshToken
    });

    if (!session) {
        throw createHttpError(401, 'Session not found');
    }

    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
        throw createHttpError(401, 'Session token expired');
    }

    const newSession = createSession();
    await sessionSchemaCollection.deleteOne({
        _id: sessionId, refreshToken
    });
    return await sessionSchemaCollection.create({
        userId: session.userId,
        ...newSession,
    });
};

export const logoutUser = async (sessionId) => {
    await sessionSchemaCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
    const user = await usersSchemaCollection.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    const resetToken = jwt.sign({
        sub: user._id,
        email,
    },
        getEnvVar('JWT_SECRET'),
        {
            expiresIn: '15m',
        },
    );
    const resetPasswordTemplatePath = path.join(TEMPLATES_DIR, 'reset-password-email.html',);
    const templateSource = ((await fs.readFile(resetPasswordTemplatePath)).toString());
    const template = handlebars.compile(templateSource);
    const html = template({
        name: user.name,
        link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${resetToken}`,
    });
    await sendEmail({
        from: getEnvVar(SMTP.SMTP_FROM),
        to: email,
        subject: 'Reset your password',
        html,
    });
    if (!sendEmail) {
        throw createHttpError(500, 'Failed to send the email, please try again later.')
    }
};

export const resetPassword = async (payload) => {
    let entires;
    try {
        entires = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
    }
    catch (error) {
        if (error instanceof Error) throw createHttpError(401, error.message);
        throw error;
    }

    const user = await usersSchemaCollection.findOne({
        email: entires.email,
        _id: entires.sub,
    });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    await usersSchemaCollection.updateOne({
        _id: user._id
    },
        { password: encryptedPassword },);
};