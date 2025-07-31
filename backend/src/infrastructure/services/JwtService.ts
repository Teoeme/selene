import { JwtService } from "@/domain/services/JwtService";
import jwt ,{SignOptions } from 'jsonwebtoken';
import { StringValue } from "ms";
import { config } from '../../config/env';

export class JwtServiceImpl implements JwtService {
    async generateToken(userId: string): Promise<string> {
        const payload = { userId };
        const options: SignOptions = {
            expiresIn: config.jwt.expiresIn as StringValue
        };

        const token = jwt.sign(payload, config.jwt.secret, options);
        return token;
    }

    async verifyToken(token: string): Promise<{ userId: string }> {
        const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
        return { userId: decoded.userId };
    }

}