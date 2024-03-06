import * as spot_repository from '@/repository/spot_repository';
import * as users_to_spots_repository from '@/repository/users_to_spots_repository';
import { newGetAllSpotsResponse, newGetSpotByIDResponse, newGetSpotsByKeywordResponse } from '@/response/spot_response';
import * as schema from '@/schema';
import { DrizzleD1Database } from 'drizzle-orm/d1';

interface ISpotOperationParams<T = any> {
    db: DrizzleD1Database<typeof schema>;
    req?: T
};

export const getAllSpots = async ({ db }: ISpotOperationParams) => {
    const result = await spot_repository.getAllSpots({ db }).catch((err) => {
        throw new Error(err);
    });

    return newGetAllSpotsResponse(result);
};

export const getSpotById = async ({ db, req }: ISpotOperationParams<{ id: number }>) => {
    const result = await spot_repository.getSpotById({ db, req }).catch((err) => {
        throw new Error(err);
    });

    if (!result) {
        throw new Error('Spot not found');
    }

    return newGetSpotByIDResponse(result);
};

export const getSpotsByKeyword = async ({ db, req }: ISpotOperationParams<{ keyword: string }>) => {
    const result = await spot_repository.getSpotsByKeyword({ db, req }).catch((err) => {
        throw new Error(err);
    });

    return newGetSpotsByKeywordResponse(result);
};

type CreateSpotParams = {
    name: string;
    address: string;
    prefecture_id: number;
    // school_id: number;
    author_id: string;
};

export const createSpot = async ({ db, req }: ISpotOperationParams<CreateSpotParams>) => {
    const result = await spot_repository.createSpot({ db, req }).catch((err) => {
        throw new Error(err);
    });

    return result;
}

type UpdateSpotParams = {
    id: number;
    name?: string;
    address?: string;
    prefecture_id?: number;
    // school_id?: number;
};

export const updateSpot = async ({ db, req }: ISpotOperationParams<UpdateSpotParams>) => {
    const result = await spot_repository.updateSpot({ db, req }).catch((err) => {
        throw new Error(err);
    });

    return result;
}

export const deleteSpot = async ({ db, req }: ISpotOperationParams<{ id: number, author_id: string }>) => {
    const result = await spot_repository.deleteSpot({ db, req }).catch((err) => {
        throw new Error(err);
    });

    return result;
}

export const addFavoriteSpot = async ({ db, user_id, spot_id }: { db: DrizzleD1Database<typeof schema>, user_id: string, spot_id: number }) => {
    const result = await users_to_spots_repository.createUsersToSpots({ db, req: { user_id, spot_id } }).catch((err) => {
        throw new Error(err);
    });

    return result;
};

export const removeFavoriteSpot = async ({ db, user_id, spot_id }: { db: DrizzleD1Database<typeof schema>, user_id: string, spot_id: number }) => {
    const result = await users_to_spots_repository.deleteUsersToSpots({ db, req: { user_id, spot_id } }).catch((err) => {
        throw new Error(err);
    });

    return result;
};
