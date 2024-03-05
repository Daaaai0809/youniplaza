import * as schema from '@/schema';
import { eq } from 'drizzle-orm';
import { DrizzleD1Database } from 'drizzle-orm/d1';

interface IRestaurantOperationParams<T = any> {
    db: DrizzleD1Database<typeof schema>;
    req?: T
};

export const getAllRestaurants = async ({ db }: IRestaurantOperationParams) => {
    const result = await db.query.restaurants.findMany({
        where: ((restaurants, { isNull }) => isNull(restaurants.deleted_at)),
    });

    return result;
};

export const getRestaurantById = async ({ db, req }: IRestaurantOperationParams<{ id: number }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.query.restaurants.findFirst({
        where: ((restaurants, { and, eq, isNull }) => and(eq(restaurants.id, req.id), isNull(restaurants.deleted_at))),
        with: {
            comments: true,
        }
    });

    return result;
};

export const getRestaurantsByKeyword = async ({ db, req }: IRestaurantOperationParams<{ keyword: string }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.query.restaurants.findMany({
        where: ((restaurants, { and, like, isNull }) => and(like(restaurants.name, `%${req.keyword}%`), isNull(restaurants.deleted_at))),
    });

    return result;
};

type CreateRestaurantParams = {
    name: string;
    address: string;
    prefecture_id: number;
    // school_id: number;
};

export const createRestaurant = async ({ db, req }: IRestaurantOperationParams<CreateRestaurantParams>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.insert(schema.restaurants).values({
        name: req.name,
        address: req.address,
        prefecture_id: req.prefecture_id,
        // school_id: req.school_id,
    }).execute();

    return result;
};

type UpdateRestaurantParams = {
    id: number;
    name?: string;
    address?: string;
    prefecture_id?: number;
    rating?: number;
};

export const updateRestaurant = async ({ db, req }: IRestaurantOperationParams<UpdateRestaurantParams>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.update(schema.restaurants).set({
        name: req.name,
        address: req.address,
        prefecture_id: req.prefecture_id,
        rating: req.rating,
    }).where(eq(schema.restaurants.id, req.id)).execute();

    return result;
};

export const deleteRestaurant = async ({ db, req }: IRestaurantOperationParams<{ id: number }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.update(schema.restaurants).set({
        deleted_at: new Date().toISOString(),
    }).where(eq(schema.restaurants.id, req.id)).execute();

    return result;
}
