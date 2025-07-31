import { Benefit } from "../src/domain/entities/Benefit";
import { BenefitRequest } from "../src/domain/entities/BenefitRequest";
import { Company } from "../src/domain/entities/Company";
import { User } from "../src/domain/entities/User";
import { BenefitRepository } from "../src/domain/repositories/BenefitRepository";
import { BenefitRequestRepository } from "../src/domain/repositories/BenefitRequestRepository";
import { CompanyRepository } from "../src/domain/repositories/CompanyRepository";
import { UserRepository } from "../src/domain/repositories/UserRepository";
import { PasswordService } from "../src/domain/services/PasswordService";
import { BenefitType } from "../src/domain/value-objects/BenefitType";
import { RequestStatus } from "../src/domain/value-objects/RequestStatus";
import { UserRole } from "../src/domain/value-objects/UserRole";
import { Container } from "../src/infrastructure/di/container";
import { connectToDatabase } from "../src/infrastructure/database/connection";

class DatabaseSeeder {
    private container: Container;
    private userRepository: UserRepository
    private companyRepository: CompanyRepository
    private benefitRequestRepository: BenefitRequestRepository
    private passwordService: PasswordService
    private benfitRepository: BenefitRepository
    
    constructor(){
        this.container = Container.getInstance();
        this.userRepository = this.container.getUserRepository();
        this.companyRepository = this.container.getCompanyRepository();
        this.benefitRequestRepository = this.container.getBenefitRequestRepository();
        this.passwordService = this.container.getPasswordService();
        this.benfitRepository = this.container.getBenefitRepository();
    }

    async seed(){
        console.log('Iniciando datos demo...')

        await this.cleanDatabase();
        const companies = await this.createCompanies();
        const users = await this.createUsers(companies);
        const benefits = await this.createBenefits(companies);
        await this.createBenefitRequests(users, benefits);

        console.log('Datos demo creados exitosamente')
        console.log(`\n Datos creados:`)
        console.log(`- ${companies.length} empresas`)
        console.log(`- ${users.length} usuarios`)
        console.log(`- ${benefits.length} beneficios`)


    }

    private async cleanDatabase(){
        console.log('Limpiando base de datos...')
        
        await this.userRepository.deleteAll();
        await this.companyRepository.deleteAll();
        await this.benefitRequestRepository.deleteAll();
        await this.benfitRepository.deleteAll();
    }

    private async createCompanies(){
        console.log('Creando empresas...')
        const companies = [
            new Company('selene-company',
                'Selene',
                'Soluciones en Comunicación, Software y Capital Humano.',
                new Date(),
                new Date()
            ),
            new Company(
                'helios-company',
                'Helios Energía Limpia',
                'Única planta de latinoamérica en producir biogás utilizando un 100% de sustratos orgánicos industriales. 2,4 MWH. DE ENERGÍA RENOVABLE',
                new Date(),
                new Date()
            )
        ]

        for(const company of companies){
            await this.companyRepository.save(company);
        }

        console.log('Empresas creadas exitosamente')
        return companies;
    }

    private async createUsers(companies:Company[]){
        console.log('Creando usuarios...')

        const users = [
            new User(
                'selene-employee',
                'employee@selene.com',
                'Empleado de Selene',
                'admin123',
                UserRole.EMPLOYEE,
                companies[0],
                new Date(),
                new Date()
            ),
            new User(
                'selene-admin',
                'admin@selene.com',
                'Administrador de Selene',
                'admin123',
                UserRole.ADMIN,
                companies[0],
                new Date(),
                new Date()
            ),
            new User(
                'helios-employee',
                'employee@helios.com',
                'Empleado de Helios',
                'employee123',
                UserRole.EMPLOYEE,
                companies[1],
                new Date(),
                new Date()
            ),
            new User(
                'helios-admin',
                'admin@helios.com',
                'Administrador de Helios',
                'admin123',
                UserRole.ADMIN,
                companies[1],
                new Date(),
                new Date()
            )
        ]

        for(const user of users){   
            const hashedPassword = await this.passwordService.hashPassword(user.getPassword());
            const userData=new User(
                user.getId(),
                user.getEmail(),
                user.getName(),
                hashedPassword,
                user.getRole(),
                user.getCompany(),
                user.getCreatedAt(),
                user.getUpdatedAt()
            );
            await this.userRepository.save(userData);
        }

        return users;
    }

    private async createBenefits(companies:Company[]){
        console.log('Creando beneficios...')

        const benefits = [
            new Benefit(
                'benefit-curse',
                'Curso de arquitectura hexagonal',
                'Curso de arquitectura hexagonal con typescript, para desarrolladores que buscan mejorar su codigo',
                BenefitType.COURSE,
                true,
                companies[0],
                new Date(),
                new Date()
            ),
            new Benefit(
                'benefit-meal',
                'Beneficio de comida - Menu ejecutivo',
                'Beneficio de comida para los empleados de la empresa',
                BenefitType.MEAL,
                true,
                companies[0],
                new Date(),
                new Date()
            ),
            new Benefit(
                'benefit-curse-2',
                'Capacitación en Biogás y Biodigestores',
                'Este curso te permite Iniciar desde Cero y Conseguir en solo un mes conocimientos en Biogás y Biodigestores',
                BenefitType.COURSE,
                true,
                companies[1],
                new Date(),
                new Date()
            ),
            new Benefit(
                'benefit-licence',
                'Licencia de software - Solidworks',
                'Licencia de software para el uso de Solidworks',
                BenefitType.LICENSE,
                true,
                companies[1],
                new Date(),
                new Date()
            )
        ]

        for(const benefit of benefits){
            await this.benfitRepository.save(benefit);
        }

        console.log('Beneficios creados exitosamente')
        return benefits;
    }

    private async createBenefitRequests(users:User[], benefits:Benefit[]){
        console.log('Creando solicitudes de beneficios...')

        const benefitRequests = [
            new BenefitRequest(
                'benefit-request-1',
                benefits[0],
                'Me gustaría aprender sobre la arquitectura hexagonal para el nuevo proyecto.',
                RequestStatus.PENDING,
                new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 5),
                null,
                users[0],
                users[0].getCompany(),
                new Date(),
                new Date()
            ),
            new BenefitRequest(
                'benefit-request-2',
                benefits[3],
                'Me gustaría obtener una licencia de software para el uso de Solidworks',
                RequestStatus.PENDING,
                new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 2),
                null,
                users[1],
                users[1].getCompany(),
                new Date(),
                new Date()
            )
        ]

        for(const benefitRequest of benefitRequests){
            await this.benefitRequestRepository.save(benefitRequest);
        }

        console.log('Solicitudes de beneficios creadas exitosamente')
        return benefitRequests;
    }
}

async function main(){
    try{
        await connectToDatabase()
        const seeder = new DatabaseSeeder();
        await seeder.seed();
        process.exit(0);
    }catch(error){
        console.error('Error al crear los datos demo:', error);
        process.exit(1);
    }
}

main();