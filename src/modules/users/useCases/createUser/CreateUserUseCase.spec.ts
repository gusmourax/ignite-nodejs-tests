import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    })

    it('should create a new user', async () => {
        const user = await createUserUseCase.execute({
            name: 'Teste',
            email: 'teste@rocketseat.com',
            password: '123456',
        })

        expect(user).toHaveProperty('id');
    })

})