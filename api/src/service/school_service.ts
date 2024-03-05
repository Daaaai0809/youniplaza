import * as repository from '@/repository/school_repository';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from '@/schema';
import { newGetSchoolByIDResponse, newGetSchoolsByKeywordResponse, newGetSchoolsByPrefecturesResponse, newGetSchoolsResponse } from '@/response/school_response';

export const getSchools = async ({ db }: { db: DrizzleD1Database<typeof schema>}) => {
  const result = await repository.getAllSchools({ db }).catch((err) => {
    throw new Error(err);
  });

  return newGetSchoolsResponse(result);
};

export const getSchoolByID = async ({ db, id }: { db: DrizzleD1Database<typeof schema>, id: number }) => {
  const result = await repository.getSchoolById({ db, req: { id } }).catch((err) => {
    throw new Error(err);
  });

  if (!result) {
    throw new Error('School not found');
  }

  return newGetSchoolByIDResponse(result);
};

export const getSchoolsByKeyword = async ({ db, keyword }: { db: DrizzleD1Database<typeof schema>, keyword: string }) => {
    const result = await repository.getSchoolsByKeyword({ db, req: { keyword } }).catch((err) => {
        throw new Error(err);
    });
    
    return newGetSchoolsByKeywordResponse(result);
};

export const getSchoolsByPrefecture = async ({ db, prefecture_ids }: { db: DrizzleD1Database<typeof schema>, prefecture_ids: number[] }) => {
    const result = await repository.getSchoolsByPrefecture({ db, req: { prefecture_ids } }).catch((err) => {
        throw new Error(err);
    });
    
    return newGetSchoolsByPrefecturesResponse(result);
}

type CreateSchoolParams = {
    name: string;
    prefecture_id: number;
    address: string;
};

export const createSchool = async ({ db, req }: { db: DrizzleD1Database<typeof schema>, req: CreateSchoolParams }) => {
  const result = await repository.createSchool({ db, req }).catch((err) => {
    throw new Error(err);
  });

  return result;
}

type UpdateSchoolParams = {
    id: number;
    name?: string;
    prefecture_id?: number;
    address?: string;
};

export const updateSchool = async ({ db, req }: { db: DrizzleD1Database<typeof schema>, req: UpdateSchoolParams}) => {
  const result = await repository.updateSchool({ db, req }).catch((err) => {
    throw new Error(err);
  });

  return result;
}

export const deleteSchool = async ({ db, id }: { db: DrizzleD1Database<typeof schema>, id: number }) => {
    const result = await repository.deleteSchool({ db, req: { id }}).catch((err) => {
        throw new Error(err);
    });
    
    return result;
};
