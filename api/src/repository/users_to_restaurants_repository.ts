import * as schema from '@/schema';
import { and, eq } from 'drizzle-orm';
import { DrizzleD1Database } from 'drizzle-orm/d1';

interface IUsersToRestaurantsOperationParams<T = any> {
    db: DrizzleD1Database<typeof schema>;
    req?: T
};

export const createUsersToRestaurants = async ({ db, req }: IUsersToRestaurantsOperationParams<{ user_id: string, restaurant_id: number }> ) => {
    if (!req?.user_id || !req?.restaurant_id) {
        throw new Error('user_id and restaurant_id are required');
    }

    const result = await db.insert(schema.users_to_restaurants).values({
        user_id: req.user_id,
        restaurant_id: req.restaurant_id
    }).execute().catch((err) => {
        throw new Error(err);
    });

    return result;
};

export const deleteUsersToRestaurants = async ({ db, req }: IUsersToRestaurantsOperationParams<{ user_id: string, restaurant_id: number }> ) => {
    if (!req?.user_id || !req?.restaurant_id) {
        throw new Error('user_id and restaurant_id are required');
    }

    const result = await db.delete(schema.users_to_restaurants).where(and(
        eq(schema.users_to_restaurants.user_id, req.user_id),
        eq(schema.users_to_restaurants.restaurant_id, req.restaurant_id)
    )).execute().catch((err) => {
        throw new Error(err);
    });

    return result;
}
