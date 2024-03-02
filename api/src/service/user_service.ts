import * as repository from '@/repository/user_repository';
import { DrizzleD1Database } from 'drizzle-orm/d1';
import * as schema from '@/schema';
import { CreateUserRequest, UpdateUserRequest } from '@/request/user_request';
import { newGetUserByIDResponse, newGetUserByKeywordResponse, newGetUsersResponse } from '@/response/user_response';

export const getUsers = async ({ db }: { db: DrizzleD1Database<typeof schema>}) => {
  const result = await repository.getAllUsers({ db }).catch((err) => {
    throw new Error(err);
  });

  return newGetUsersResponse(result);
}

export const getUserByID = async ({ db, id }: { db: DrizzleD1Database<typeof schema>, id: string }) => {
  const result = await repository.getUserById({ db, req: { id } }).catch((err) => {
    throw new Error(err);
  });

  if (!result) {
    throw new Error('User not found');
  }

  return newGetUserByIDResponse(result);
}

export const getUserByKeyword = async ({ db, keyword }: { db: DrizzleD1Database<typeof schema>, keyword: string }) => {
    const result = await repository.getUserByKeyword({ db, req: { keyword } }).catch((err) => {
        throw new Error(err);
    });
    
    return newGetUserByKeywordResponse(result);
}

export const createUser = async ({ db, req }: { db: DrizzleD1Database<typeof schema>, req: CreateUserRequest }) => {
  const result = await repository.createUser({ db, req }).catch((err) => {
    throw new Error(err);
  });

  return result;
}

export const updateUser = async ({ db, req }: { db: DrizzleD1Database<typeof schema>, req: UpdateUserRequest }) => {
  const result = await repository.updateUser({ db, req }).catch((err) => {
    throw new Error(err);
  });

  return result;
}

export const deleteUser = async ({ db, id }: { db: DrizzleD1Database<typeof schema>, id: string }) => {
  const result = await repository.deleteUser({ db, req: { id }}).catch((err) => {
    throw new Error(err);
  });

  return result;
}
