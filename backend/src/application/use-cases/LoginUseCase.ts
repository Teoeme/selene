import { UserRepository } from "../../domain/repositories/UserRepository";
import { JwtService } from "../../domain/services/JwtService";
import { PasswordService } from "../../domain/services/PasswordService";

interface LoginUseCaseInput {
    email: string;
    password: string;
}

interface LoginUseCaseOutput {
    token: string;
}

export class LoginUseCase {
    private readonly userRepository: UserRepository;
    private readonly jwtService: JwtService;
    private readonly passwordService: PasswordService;

    constructor({
        userRepository,
        jwtService,
        passwordService
    }: {
        userRepository: UserRepository;
        jwtService: JwtService;
        passwordService: PasswordService;
    }) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordService = passwordService;
    }


    async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
        const user = await this.userRepository.findByEmail(input.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await this.passwordService.comparePassword(
            input.password, 
            user.getPassword()
        );
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }


        const token = await this.jwtService.generateToken(user.getId());
        
        return { token };
    }
}