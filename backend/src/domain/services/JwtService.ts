export interface JwtService {
    generateToken(userId: string): Promise<string>;
    verifyToken(token: string): Promise<{ userId: string }>;
}