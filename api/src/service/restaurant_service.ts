import * as restaurant_repository from '@/repository/restaurant_repository';
import * as users_to_restaurants_repository from '@/repository/users_to_restaurants_repository';
import { newGetAllRestaurantsResponse, newGetRestaurantByIDResponse, newGetRestaurantsByKeywordResponse } from '@/response/restaurant_response';
import * as schema from '@/schema';
import { DrizzleD1Database } from 'drizzle-orm/d1';

interface IRestaurantOperationParams<T = any> {
    db: DrizzleD1Database<typeof schema>;
    req?: T
};

export const getAllRestaurants = async ({ db }: IRestaurantOperationParams) => {
    const result = await restaurant_repository.getAllRestaurants({ db }).catch((err) => {
        throw new Error(err);
    });

    return newGetAllRestaurantsResponse(result);
};

export const getRestaurantById = async ({ db, id }: { db: DrizzleD1Database<typeof schema>, id: number }) => {
    const result = await restaurant_repository.getRestaurantById({ db, req: { id } }).catch((err) => {
        throw new Error(err);
    });

    if (!result) {
        throw new Error('Restaurant not found');
    }

    return newGetRestaurantByIDResponse(result);
};

export const getRestaurantsByKeyword = async ({ db, keyword }: { db: DrizzleD1Database<typeof schema>, keyword: string }) => {
    const result = await restaurant_repository.getRestaurantsByKeyword({ db, req: { keyword } }).catch((err) => {
        throw new Error(err);
    });

    return newGetRestaurantsByKeywordResponse(result);
};

type CreateRestaurantParams = {
    name: string;
    address: string;
    prefecture_id: number;
    // school_id: number;
    author_id: string;
};

export const createRestaurant = async ({ db, req }: { db: DrizzleD1Database<typeof schema>, req: CreateRestaurantParams }) => {
    const result = await restaurant_repository.createRestaurant({ db, req }).catch((err) => {
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
    const result = await restaurant_repository.updateRestaurant({ db, req }).catch((err) => {
        throw new Error(err);
    });

    return result;
}

export const deleteRestaurant = async ({ db, id, author_id }: { db: DrizzleD1Database<typeof schema>, id: number, author_id: string }) => {
    const result = await restaurant_repository.deleteRestaurant({ db, req: { id, author_id } }).catch((err) => {
        throw new Error(err);
    });

    return result;
}

export const addFavoriteRestaurant = async ({ db, user_id, restaurant_id }: { db: DrizzleD1Database<typeof schema>, user_id: string, restaurant_id: number }) => {
    const result = await users_to_restaurants_repository.createUsersToRestaurants({ db, req: { user_id, restaurant_id } }).catch((err) => {
        throw new Error(err);
    });

    return result;
};

export const removeFavoriteRestaurant = async ({ db, user_id, restaurant_id }: { db: DrizzleD1Database<typeof schema>, user_id: string, restaurant_id: number }) => {
    const result = await users_to_restaurants_repository.deleteUsersToRestaurants({ db, req: { user_id, restaurant_id } }).catch((err) => {
        throw new Error(err);
    });

    return result;
};
