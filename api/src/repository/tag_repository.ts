import * as schema from '@/schema';
import { eq } from 'drizzle-orm';
import { DrizzleD1Database } from 'drizzle-orm/d1';

interface ITagOperationParams<T = any> {
    db: DrizzleD1Database<typeof schema>;
    req?: T
};

export const getAllTags = async ({ db }: ITagOperationParams) => {
    const result = await db.query.tags.findMany({
        where: ((tags, { isNull }) => isNull(tags.deleted_at)),
    });

    return result;
};

export const getTagById = async ({ db, req }: ITagOperationParams<{ id: number }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.query.tags.findFirst({
        where: ((tags, { and, eq, isNull }) => and(eq(tags.id, req.id), isNull(tags.deleted_at))),
    });

    return result;
};

export const getTagsByKeyword = async ({ db, req }: ITagOperationParams<{ keyword: string }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.query.tags.findMany({
        where: ((tags, { and, like, isNull }) => and(like(tags.name, `%${req.keyword}%`), isNull(tags.deleted_at))),
    });

    return result;
};

type CreateTagParams = {
    name: string;
};

export const createTag = async ({ db, req }: ITagOperationParams<CreateTagParams>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.insert(schema.tags).values({
        name: req.name,
    }).execute();

    return result;
};

export const updateTag = async ({ db, req }: ITagOperationParams<{ id: number, name: string }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.update(schema.tags).set({
        name: req.name,
    }).where(eq(schema.tags.id, req.id)).execute();

    return result;
};

export const deleteTag = async ({ db, req }: ITagOperationParams<{ id: number }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.update(schema.tags).set({
        deleted_at: new Date().toISOString(),
    }).where(eq(schema.tags.id, req.id)).execute();

    return result;
}
