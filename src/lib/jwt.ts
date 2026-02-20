import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const EXPIRES_IN = '1d';

interface TokenPayload {
    userId: string;
    role: string;
}

/**
 * Sign a JWT token
 * @param payload - object with userId and role
 * @returns signed token string
 */
export function signToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}

/**
 * Verify a JWT token
 * @param token - JWT string
 * @returns decoded payload or null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
}
