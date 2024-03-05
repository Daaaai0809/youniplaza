interface IUser {
    id: string;
    username: string;
    name: string;
    email: string;
    school: {
        id: number;
        name: string;
        prefecture_id: number;
        address: string;
    } | null;
}

export type User = {
    id: string;
    username: string;
    name: string;
    email: string;
    school: {
        id: number;
        name: string;
        prefecture_id: number;
        address: string;
    } | null;
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
        users: users.map((user) => {
            return {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                school: user.school
            }
        }),
    }
}

export const newGetUserByIDResponse = (user: IUser): GetUserByIDResponse => {
    return {
        user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            school: user.school
        },
    }
}

export const newGetUserByKeywordResponse = (users: IUser[]): GetUserByKeywordResponse => {
    return {
        users: users.map((user) => {
            return {
                id: user.id,
                username: user.username,
                name: user.name,
                email: user.email,
                school: user.school
            }
        }),
    }
}
