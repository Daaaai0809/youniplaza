export type LoginResponse = {
    access_token: string;
    refresh_token: string;
};

export const newLoginResponse = (access_token: string, refresh_token: string): LoginResponse => {
    return {
        access_token,
        refresh_token
    }
}
