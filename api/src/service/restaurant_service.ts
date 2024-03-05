import * as repository from '@/repository/restaurant_repository';
import * as schema from '@/schema';
import { DrizzleD1Database } from 'drizzle-orm/d1';

interface IRestaurantOperationParams<T = any> {
    db: DrizzleD1Database<typeof schema>;
    req?: T
};

export const getAllRestaurants = async ({ db }: IRestaurantOperationParams) => {
    const result = await repository.getAllRestaurants({ db }).catch((err) => {
        throw new Error(err);
    });

    return result;
};

export const getRestaurantById = async ({ db, id }: { db: DrizzleD1Database<typeof schema>, id: number }) => {
    const result = await repository.getRestaurantById({ db, req: { id } }).catch((err) => {
        throw new Error(err);
    });

    if (!result) {
        throw new Error('Restaurant not found');
    }

    return result;
};

export const getRestaurantsByKeyword = async ({ db, keyword }: { db: DrizzleD1Database<typeof schema>, keyword: string }) => {
    const result = await repository.getRestaurantsByKeyword({ db, req: { keyword } }).catch((err) => {
        throw new Error(err);
    });

    return result;
};

type CreateRestaurantParams = {
    name: string;
    address: string;
    prefecture_id: number;
    // school_id: number;
    author_id: string;
};

export const createRestaurant = async ({ db, req }: { db: DrizzleD1Database<typeof schema>, req: CreateRestaurantParams }) => {
    const result = await repository.createRestaurant({ db, req }).catch((err) => {
        throw new Error(err);
    });

    return result;
}

type UpdateRestaurantParams = {
    id: number;
    name?: string;
    address?: string;
    prefecture_id?: number;
    // school_id?: number;
};

export const updateRestaurant = async ({ db, req }: { db: DrizzleD1Database<typeof schema>, req: UpdateRestaurantParams }) => {
    const result = await repository.updateRestaurant({ db, req }).catch((err) => {
        throw new Error(err);
    });

    return result;
}

export const deleteRestaurant = async ({ db, id }: { db: DrizzleD1Database<typeof schema>, id: number }) => {
    const result = await repository.deleteRestaurant({ db, req: { id } }).catch((err) => {
        throw new Error(err);
    });

    return result;
}
