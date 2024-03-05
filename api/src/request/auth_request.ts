export type SignUpRequest = {
    username: string;
    name: string;
    password: string;
    email: string;
    school_id: number;
}

export type LoginRequest = {
    username: string;
    password: string;
}
