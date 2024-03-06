import * as schema from '@/schema';
import { and, eq } from 'drizzle-orm';
import { DrizzleD1Database } from 'drizzle-orm/d1';

interface ISpotOperationParams<T = any> {
    db: DrizzleD1Database<typeof schema>;
    req?: T
};

export const getAllSpots = async ({ db }: ISpotOperationParams) => {
    const result = await db.query.spots.findMany({
        where: ((spots, { isNull }) => isNull(spots.deleted_at)),
    });

    return result;
};

export const getSpotById = async ({ db, req }: ISpotOperationParams<{ id: number }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.query.spots.findFirst({
        where: ((spots, { and, eq, isNull }) => and(eq(spots.id, req.id), isNull(spots.deleted_at))),
        with: {
            comments: true,
        }
    });

    return result;
};

export const getSpotsByKeyword = async ({ db, req }: ISpotOperationParams<{ keyword: string }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.query.spots.findMany({
        where: ((spots, { and, like, isNull }) => and(like(spots.name, `%${req.keyword}%`), isNull(spots.deleted_at))),
    });

    return result;
};

type CreateSpotParams = {
    name: string;
    address: string;
    prefecture_id: number;
    school_id: number;
    author_id: string;
};

export const createSpot = async ({ db, req }: ISpotOperationParams<CreateSpotParams>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.insert(schema.spots).values({
        name: req.name,
        address: req.address,
        prefecture_id: req.prefecture_id,
        school_id: req.school_id,
        author_id: req.author_id,
    }).execute();

    return result;
};

type UpdateSpotParams = {
    id: number;
    name?: string;
    address?: string;
    prefecture_id?: number;
    school_id?: number;
    rating?: number;
};

export const updateSpot = async ({ db, req }: ISpotOperationParams<UpdateSpotParams>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.update(schema.spots).set({
        name: req.name,
        address: req.address,
        prefecture_id: req.prefecture_id,
        school_id: req.school_id,
        rating: req.rating,
    }).where(eq(schema.spots.id, req.id)).execute();

    return result;
};

export const deleteSpot = async ({ db, req }: ISpotOperationParams<{ id: number, author_id: string }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.update(schema.spots).set({
        deleted_at: new Date().toISOString(),
    }).where(and(eq(schema.spots.id, req.id), eq(schema.spots.author_id, req.author_id))).execute();

    return result;
}

export const strictDeleteSpot = async ({ db, req }: ISpotOperationParams<{ id: number }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.delete(schema.spots).where(eq(schema.spots.id, req.id)).execute();

    return result;
}
