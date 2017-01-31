import { auth } from 'config';
import jwt from 'jsonwebtoken';

export default (ctx) => {
    if (!ctx.ezMasterConfig) {
        throw new Error('Invalid EzMaster configuration.');
    }

    if (!ctx.ezMasterConfig.username) {
        throw new Error('Invalid EzMaster configuration: missing username');
    }

    if (!ctx.ezMasterConfig.password) {
        throw new Error('Invalid EzMaster configuration: missing password.');
    }

    const { username, password } = ctx.request.body;
    if (username !== ctx.ezMasterConfig.username || password !== ctx.ezMasterConfig.password) {
        ctx.status = 401;
        return;
    }

    const tokenData = {
        username,
        exp: Math.ceil(Date.now() / 1000) + auth.expiresIn,
    };

    const cookieToken = jwt.sign(tokenData, auth.cookieSecret);
    const headerToken = jwt.sign(tokenData, auth.headerSecret);

    ctx.cookies.set('lodex_token', cookieToken, { httpOnly: true });
    ctx.body = {
        token: headerToken,
    };
};
