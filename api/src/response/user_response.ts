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
