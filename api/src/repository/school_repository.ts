import { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from '@/schema';
import { CreateSchoolRequest, UpdateSchoolRequest } from '@/request/school_request';
import { eq, inArray } from 'drizzle-orm';

interface ISchoolOperationParams<T = any> {
    db: DrizzleD1Database<typeof schema>;
    req?: T
}

export const getAllSchools = async ({ db }: ISchoolOperationParams) => {
    const result = await db.query.schools.findMany({
        where: ((schools, { isNull }) => isNull(schools.deleted_at)),
    });

    return result;
};

export const getSchoolsById = async ({ db, req }: ISchoolOperationParams<{ id: number }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.query.schools.findFirst({
        where: ((schools, { and, eq, isNull }) => and(eq(schools.id, req.id), isNull(schools.deleted_at))),
    });

    return result;
}

export const getSchoolsByKeyword = async ({ db, req }: ISchoolOperationParams<{ keyword: string }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.query.schools.findMany({
        where: ((schools, { and, like, isNull }) => and(like(schools.name, `%${req.keyword}%`), isNull(schools.deleted_at))),
    });

    return result;
}

export const getSchoolsByPrefecture = async ({ db, req }: ISchoolOperationParams<{ prefecture_ids: number[] }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.query.schools.findMany({
        where: ((schools, { and, isNull }) => and(inArray(schools.prefecture_id, req.prefecture_ids), isNull(schools.deleted_at))),
    });

    return result;
}

export const createSchool = async ({ db, req }: ISchoolOperationParams<CreateSchoolRequest>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.insert(schema.schools).values({
        name: req.name,
        prefecture_id: req.prefecture_id,
        address: req.address,
    }).execute();

    return result;
};

export const updateSchool = async ({ db, req }: ISchoolOperationParams<UpdateSchoolRequest & { id: number }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.update(schema.schools).set({
        name: req.name,
        prefecture_id: req.prefecture_id,
        address: req.address,
    }).where(eq(schema.schools.id, req.id)).execute();

    return result;
};

export const deleteSchool = async ({ db, req }: ISchoolOperationParams<{ id: number }>) => {
    if (!req) {
        throw new Error('Invalid request');
    }

    const result = await db.update(schema.schools).set({
        deleted_at: new Date().toISOString(),
    }).execute();

    return result;
};
