import { sha256 } from 'hono/utils/crypto';

export const hashPassword = async (password: string) => {
    const hashedPassword = await sha256(password);
    if (!hashedPassword) {
        throw new Error('Failed to hash password');
    }

    return hashedPassword;
}
