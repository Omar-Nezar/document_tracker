import { hash, verify } from "@node-rs/argon2";

export const hashPassword = async (password: string) => {
    return hash(password, {
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
    });
};

export const comparePassword = async (
    password: string,
    hashed: string
) => {
    return verify(hashed, password);
};