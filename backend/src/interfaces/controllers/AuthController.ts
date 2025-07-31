import { Request, Response } from "express";
import { LoginSchema } from "../schemas/LoginSchemas";
import { ResponseFactory } from "../responses/ResponseFactory";
import { LoginUseCase } from "../../application/use-cases/LoginUseCase";
import { Container } from "../../infrastructure/di/container";

export class AuthController {
    private readonly loginUseCase: LoginUseCase;

    constructor() {
        const container = Container.getInstance();
        this.loginUseCase = new LoginUseCase({
            userRepository: container.getUserRepository(),
            jwtService: container.getJwtService(),
            passwordService: container.getPasswordService()
        });
    }

    login = async (req: Request, res: Response) => {
        try {
            const validation = LoginSchema.safeParse(req.body);
            if (!validation.success) {
                return ResponseFactory.validationError(res, 'Invalid request', validation.error);
            }

            const { email, password } = validation.data;

            const result = await this.loginUseCase.execute({ email, password });
            return ResponseFactory.success(res, 'Login successful', result);
            
        } catch (error) {
            console.error('Login error:', error);
            
            if (error instanceof Error && error.message === 'Invalid credentials') {
                return ResponseFactory.unauthorized(res, 'Invalid email or password');
            }
            
            return ResponseFactory.internalError(res, 'Login failed');
        }
    }

    logout = async (req: Request, res: Response) => {
        return ResponseFactory.success(res, 'Logout successful');
    }


}