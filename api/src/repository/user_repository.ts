import { DrizzleD1Database } from 'drizzle-orm/d1';
import { v4 as uuidv4 } from 'uuid';
import * as schema from '@/schema';
import { hashPassword } from '@/utils/hash_password';
import { eq } from 'drizzle-orm';

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
        where: ((users, { and, eq, isNull }) => and(eq(users.id, req.id), isNull(users.deleted_at))),
        with: {
            school: true,
        }
    });

    return result;
}

export const getUserByKeyword = async ({ db, req }: IUserOperationParams<{ keyword: string }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.query.users.findMany({
        where: ((users, { and, like, or, isNull }) => and(or(like(users.username, `%${req.keyword}%`), like(users.name, `%${req.keyword}%`)), isNull(users.deleted_at))),
        with: {
            school: true,
        }
    });

    return result;
}

export const getUserByUsername = async ({ db, req }: IUserOperationParams<{ username: string }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.query.users.findFirst({
        where: ((users, { and, eq, isNull }) => and(eq(users.username, req.username), isNull(users.deleted_at))),
        with: {
            school: true,
        }
    });

    return result;
}

type CreateUserParams = {
    username: string;
    name: string;
    password: string;
    email: string;
    school_id: number;
};

export const createUser = async ({ db, req }: IUserOperationParams<CreateUserParams>) => {
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
        school_id: req.school_id,
    }).execute().catch((err) => {
        throw new Error(err);
    });

    return result;
}

type UpdateUserParams = {
    id: string;
    username?: string;
    name?: string;
    password?: string;
    email?: string;
    school_id?: number;
};

export const updateUser = async ({ db, req }: IUserOperationParams<UpdateUserParams>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.update(schema.users).set({
        username: req.username,
        name: req.name,
        password: req.password ? await hashPassword(req.password) : undefined,
        email: req.email,
        school_id: req.school_id,
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
