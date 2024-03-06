import { newGetAllTagsResponse, newGetTagByIDResponse, newGetTagsByKeywordResponse } from '@/response/tag_reponse';
import * as schema from '@/schema';
import * as tag_repository from '@/repository/tag_repository';
import * as tag_to_spots_repository from '@/repository/tag_to_spots_repository';
import { DrizzleD1Database } from 'drizzle-orm/d1';

interface ITagOperationParams<T = any> {
    db: DrizzleD1Database<typeof schema>;
    req?: T
};

export const getAllTags = async ({ db }: ITagOperationParams) => {
    const result = await tag_repository.getAllTags({ db }).catch((err) => {
        throw new Error(err);
    });

    return newGetAllTagsResponse(result);
};

export const getTagById = async ({ db, req }: ITagOperationParams<{ id: number }>) => {
    const result = await tag_repository.getTagById({ db, req }).catch((err) => {
        throw new Error(err);
    });

    if (!result) {
        throw new Error('Tag not found');
    }

    return newGetTagByIDResponse(result);
};

export const getTagsByKeyword = async ({ db, req }: ITagOperationParams<{ keyword: string }>) => {
    const result = await tag_repository.getTagsByKeyword({ db, req }).catch((err) => {
        throw new Error(err);
    });

    return newGetTagsByKeywordResponse(result);
};

type CreateTagParams = {
    name: string;
};

export const createTag = async ({ db, req }: ITagOperationParams<CreateTagParams>) => {
    const result = await tag_repository.createTag({ db, req }).catch((err) => {
        throw new Error(err);
    });

    return result;
};

type UpdateTagParams = {
    id: number;
    name?: string;
};

export const updateTag = async ({ db, req }: ITagOperationParams<UpdateTagParams>) => {
    const result = await tag_repository.updateTag({ db, req }).catch((err) => {
        throw new Error(err);
    });

    return result;
};

export const deleteTag = async ({ db, id }: { db: DrizzleD1Database<typeof schema>, id: number }) => {
    const result = await tag_repository.deleteTag({ db, req: { id } }).catch((err) => {
        throw new Error(err);
    });

    await tag_to_spots_repository.deleteTagToSpotByTagId({ db, req: { tag_id: id } }).catch((err) => {
        throw new Error(err);
    });

    return result;
};
