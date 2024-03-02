interface IUser {
    id: string;
    username: string;
    name: string;
    email: string;
    // school_id: number;
}

export type User = {
    id: string;
    username: string;
    name: string;
    email: string;
    // school_id: number;
}

export type GetAllUserResponse = {
    users: User[];
}

export type GetUserByIDResponse = {
    user: User;
}

export type GetUserByKeywordResponse = {
    users: User[];
}

export type CreateUserResponse = {
    user: User;
}

export type UpdateUserResponse = {
    user: User;
}

export type DeleteUserResponse = {
    user: User;
}

export const newGetUsersResponse = (users: IUser[]): GetAllUserResponse => {
    return {
        users
    }
}

export const newGetUserByIDResponse = (user: IUser): GetUserByIDResponse => {
    return {
        user
    }
}

export const newGetUserByKeywordResponse = (users: IUser[]): GetUserByKeywordResponse => {
    return {
        users
    }
}

export const newCreateUserResponse = (user: IUser): CreateUserResponse => {
    return {
        user
    }
}

export const newUpdateUserResponse = (user: IUser): UpdateUserResponse => {
    return {
        user
    }
}

export const newDeleteUserResponse = (user: IUser): DeleteUserResponse => {
    return {
        user
    }
}
