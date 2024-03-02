export type CreateUserRequest = {
    username: string;
    name: string;
    password: string;
    email: string;
    // school_id: number;
}

export type UpdateUserRequest = {
    id: string;
    username?: string;
    name?: string;
    password?: string;
    email?: string;
    // school_id: number;
}
