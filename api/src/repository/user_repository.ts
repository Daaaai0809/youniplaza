import { DrizzleD1Database } from 'drizzle-orm/d1';
import { v4 as uuidv4 } from 'uuid';
import * as schema from '@/schema';
import { hashPassword } from '@/utils/hash_password';
import { eq } from 'drizzle-orm';
import { CreateUserRequest, UpdateUserRequest } from '@/request/user_request';

interface IUserOperationParams<T = any> {
    db: DrizzleD1Database<typeof schema>;
    req?: T
}

export const getAllUsers = async ({ db }: IUserOperationParams) => {
    const result = await db.query.users.findMany({
        where: ((users, { isNull }) => isNull(users.deleted_at)),
    });

    return result;
}

export const getUserById = async ({ db, req }: IUserOperationParams<{ id: string }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.query.users.findFirst({
        where: ((users, { eq }) => eq(users.id, req.id)),
    });

    return result;
}

export const getUserByKeyword = async ({ db, req }: IUserOperationParams<{ keyword: string }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.query.users.findMany({
        where: ((users, { like, or }) => or(like(users.username, req.keyword), like(users.name, req.keyword))),
    });

    return result;
}

export const getUserByUsername = async ({ db, req }: IUserOperationParams<{ username: string }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.query.users.findFirst({
        where: ((users, { eq }) => eq(users.username, req.username)),
    });

    return result;
}

export const createUser = async ({ db, req }: IUserOperationParams<CreateUserRequest>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const hashedPassword = await hashPassword(req.password);

    const result = await db.insert(schema.users).values({
        id: uuidv4(),
        username: req.username,
        name: req.name,
        password: hashedPassword,
        email: req.email,
        // school_id: req.school_id,
    }).execute().catch((err) => {
        throw new Error(err);
    });

    return result;
}

export const updateUser = async ({ db, req }: IUserOperationParams<UpdateUserRequest>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.update(schema.users).set({
        username: req.username,
        name: req.name,
        password: req.password,
        email: req.email,
        // school_id: req.school_id,
    }).where(eq(schema.users.id, req.id)).execute().catch((err) => {
        throw new Error(err);
    });

    return result;
}

export const deleteUser = async ({ db, req }: IUserOperationParams<{ id: string }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const now = new Date().toISOString();
    const result = await db.update(schema.users).set({
        deleted_at: now,
    }).where(eq(schema.users.id, req.id)).execute().catch((err) => {
        throw new Error(err);
    });

    return result;
}
