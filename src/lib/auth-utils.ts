import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    // Reduced from 10 to 8 rounds for faster performance while maintaining security
    // 8 rounds = ~40ms, 10 rounds = ~160ms, 12 rounds = ~640ms
    const salt = await bcrypt.genSalt(8);
    return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hash
 * @param password Plain text password
 * @param hash Hashed password from DB
 * @returns True if match
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
