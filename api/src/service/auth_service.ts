import { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from '@/schema';
import * as userRepository from '@/repository/user_repository';
import { decode, sign } from 'hono/jwt';
import { errorMessages } from '@/const/error_messages';
import { hashPassword } from '@/utils/hash_password';
import { DAY } from '@/const/time';
import { newLoginResponse } from '@/response/auth_response';
import { SignUpRequest } from '@/request/auth_request';

const TOKEN_ALGORITHM = 'HS256';

export const checkToken = async ({ token, db, blackList }: { token: string, db: DrizzleD1Database<typeof schema>, blackList: KVNamespace }) => {
    const { payload } = await decode(token);
    if (!payload) {
        throw new Error(errorMessages.auth.invalidToken);
    }

    const { iss, iat, exp, id } = payload;

    if (iss !== 'unimeshi') {
        await setBlackList({ token, blackList });
        throw new Error(errorMessages.auth.invalidToken);
    }

    if (iat > Date.now()) {
        await setBlackList({ token, blackList });
        throw new Error(errorMessages.auth.invalidToken);
    }

    if (exp < Date.now()) {
        await setBlackList({ token, blackList });
        throw new Error(errorMessages.auth.tokenExpired);
    }

    const user = await userRepository.getUserById({ db, req: { id } });
    if (!user) {
        await setBlackList({ token, blackList });
        throw new Error(errorMessages.auth.notFound);
    }

    return;
};

export const login = async ({ username, password, db, secret }: { username: string, password: string, db: DrizzleD1Database<typeof schema>, secret: string }) => {
    const user = await userRepository.getUserByUsername({ db, req: { username } });
    if (!user) {
        throw new Error(errorMessages.user.notFound);
    }

    valifyPassword({ password, hashedPassword: user.password }).catch((err) => {
        throw new Error(err);
    })

    const id = user.id;

    const accessToken = await generateToken({ id, mode: 'access', secret });
    const refreshToken = await generateToken({ id, mode: 'refresh', secret });

    return newLoginResponse(accessToken, refreshToken);
}

export const logout = async ({ token, blackList }: { token: string, blackList: KVNamespace }) => {
    await setBlackList({ token, blackList });
    return;
}

export const signUp = async ({ req, db, secret }: { req: SignUpRequest, db: DrizzleD1Database<typeof schema>, secret: string }) => {
    await userRepository.createUser({ db, req }).catch((err) => {
        throw new Error(err);
    });

    const createdUser = await userRepository.getUserByUsername({ db, req: { username: req.username } });
    if (!createdUser) {
        throw new Error(errorMessages.user.notFound);
    }

    const id = createdUser.id;

    const accessToken = await generateToken({ id, mode: 'access', secret: secret });
    const refreshToken = await generateToken({ id, mode: 'refresh', secret: secret });

    return newLoginResponse(accessToken, refreshToken);
}

export const refresh = async ({ token, db, blackList, secret }: { token: string, db: DrizzleD1Database<typeof schema>, blackList: KVNamespace, secret: string }) => {
    const { payload } = await decode(token);
    if (!payload) {
        throw new Error(errorMessages.auth.invalidToken);
    }

    const { iss, iat, exp, id } = payload;

    if (iss !== 'unimeshi') {
        throw new Error(errorMessages.auth.invalidToken);
    }

    if (iat > Date.now()) {
        throw new Error(errorMessages.auth.invalidToken);
    }

    if (exp < Date.now()) {
        throw new Error(errorMessages.auth.tokenExpired);
    }

    const user = await userRepository.getUserById({ db, req: { id } });
    if (!user) {
        throw new Error(errorMessages.auth.notFound);
    }

    const accessToken = await generateToken({ id, mode: 'access', secret });
    const refreshToken = await generateToken({ id, mode: 'refresh', secret });

    await setBlackList({ token, blackList });

    return newLoginResponse(accessToken, refreshToken);
}

const valifyPassword = async ({ password, hashedPassword }: { password: string, hashedPassword: string }) => {
    const _hashedPassword = await hashPassword(password);
    if (_hashedPassword !== hashedPassword) {
        throw new Error(errorMessages.auth.unauthorized);
    }

    return;
}

const generateToken = async ({ id, mode, secret }: { id: string, mode: 'access' | 'refresh', secret: string }) => {
    const now = Date.now();

    const exp = mode === 'access' ? now + DAY : now + DAY * 3;

    const payload = {
        iss: 'unimeshi',
        iat: now,
        exp: exp,
        id: id,
    };

    const token = await sign(payload, secret, TOKEN_ALGORITHM);

    return token;
}

const setBlackList = async ({ token, blackList }: { token: string, blackList: KVNamespace }) => {
    await blackList.put(token, 'true');
    return;
}
