import { THIRTY_DAYS } from "../constants/index.js";
import { loginOrSignUpWithGoogle, loginUser, logoutUser, refreshUsersSession, registerUser, requestResetToken, resetPassword } from "../services/auth.js";
import { generateAuthUrl } from "../utilits/googleOAuth2.js";

export const registerUserController = async (req, res) => {
    const user = await registerUser(req.body);
    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
    });
};

export const loginUserController = async (req, res) => {
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
      res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
    res.status(201).json({
        status: 201,
        message: "Successfully logged in an user!",
        data: {
            accessToken: session.accessToken,
        },
    });
};

const setupSession = (res, session) => {
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS),
    });
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + THIRTY_DAYS)
    });
}

export const refreshUsersSessionController = async (req, res) => {
    const session = await refreshUsersSession({
        sessionId: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken,
    });
    setupSession(res, session);

    res.json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: { accessToken: session.accessToken },
    });
};
export const logoutUserController = async (req, res) => {
    const sessionId = req.cookies?.sessionId;
    if (sessionId) {
        await logoutUser(sessionId);
    }
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
}

export const requestResetEmailController = async (req, res) => {
    await requestResetToken(req.body.email);
    res.json({
        status: 200,
        message: 'Reset password email was successfully sent!',
        data: {},
    });
};

export const resetPasswordController = async (req, res) => {
    await resetPassword(req.body);
    res.json({
        message: 'Password was successfully reset!',
        status: 200,
        data: {},
    })
}

export const getGoogleOAuthUrlController = async (req, res) => {
    const url = generateAuthUrl();
    res.json({
        status: 200,
        message: 'Successfully get Google OAuth Url!',
        data: {
            url,
        },
    });
}

export const loginWithGoogleController = async (req, res) => {
    const session = await loginOrSignUpWithGoogle(req.body.code);
    setupSession(res, session);
    res.json({
        status: 200,
        message: 'Successfully logged in via Google OAuth!',
        data: {
            accessToken: session.accessToken,
        },
    });
};