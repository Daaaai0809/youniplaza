import * as schema from '@/schema';
import { and, eq } from 'drizzle-orm';
import { DrizzleD1Database } from 'drizzle-orm/d1';

interface IUsersToSpotsOperationParams<T = any> {
    db: DrizzleD1Database<typeof schema>;
    req?: T
};

export const createUsersToSpots = async ({ db, req }: IUsersToSpotsOperationParams<{ user_id: string, spot_id: number }> ) => {
    if (!req?.user_id || !req?.spot_id) {
        throw new Error('user_id and spot_id are required');
    }

    const result = await db.insert(schema.users_to_spots).values({
        user_id: req.user_id,
        spot_id: req.spot_id
    }).execute().catch((err) => {
        throw new Error(err);
    });

    return result;
};

export const deleteUsersToSpots = async ({ db, req }: IUsersToSpotsOperationParams<{ user_id: string, spot_id: number }> ) => {
    if (!req?.user_id || !req?.spot_id) {
        throw new Error('user_id and spot_id are required');
    }

    const result = await db.delete(schema.users_to_spots).where(and(
        eq(schema.users_to_spots.user_id, req.user_id),
        eq(schema.users_to_spots.spot_id, req.spot_id)
    )).execute().catch((err) => {
        throw new Error(err);
    });

    return result;
}
