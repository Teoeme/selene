export interface JwtService {
    generateToken(userId: string): Promise<{token:string,expiresIn:string}>;
    verifyToken(token: string): Promise<{ userId: string }>;
}