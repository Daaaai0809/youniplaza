import * as schema from '@/schema';
import { and, eq } from 'drizzle-orm';
import { DrizzleD1Database } from 'drizzle-orm/d1';

interface ITagToSpotOperationParams<T = any> {
    db: DrizzleD1Database<typeof schema>;
    req?: T
};

export const bulkCreateTagToSpot = async ({ db, req }: ITagToSpotOperationParams<{ tag_ids: number[], spot_id: number }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.insert(schema.tag_to_spots).values(
        req.tag_ids.map((tag_id) => ({
            tag_id: tag_id,
            spot_id: req.spot_id,
        }))
    ).execute();

    return result;
};

export const deleteTagToSpot = async ({ db, req }: ITagToSpotOperationParams<{ tag_id: number, spot_id: number }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.delete(schema.tag_to_spots).where(and(eq(schema.tag_to_spots.tag_id, req.tag_id), eq(schema.tag_to_spots.spot_id, req.spot_id))).execute();

    return result;
};

export const deleteTagToSpotBySpotId = async ({ db, req }: ITagToSpotOperationParams<{ spot_id: number }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.delete(schema.tag_to_spots).where(eq(schema.tag_to_spots.spot_id, req.spot_id)).execute();

    return result;
}
