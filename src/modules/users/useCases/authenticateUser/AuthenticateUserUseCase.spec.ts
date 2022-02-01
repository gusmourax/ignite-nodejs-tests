import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    })

    it('should authenticate user', async () => {
        await createUserUseCase.execute({
            name: 'Teste',
            email: 'teste@rocketseat.com',
            password: '123456',
        })

        const authResponse = await authenticateUserUseCase.execute({
            email: 'teste@rocketseat.com',
            password: '123456',
        })

        expect(authResponse).toHaveProperty('token');
    })
})