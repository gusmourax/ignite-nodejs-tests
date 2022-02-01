import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('Get Statement Operation', () => {

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        getStatementOperationUseCase = new GetStatementOperationUseCase(
            usersRepositoryInMemory,
            statementsRepositoryInMemory
        );
        createStatementUseCase = new CreateStatementUseCase(
            usersRepositoryInMemory,
            statementsRepositoryInMemory,
        );
    })

    it('should return operation statement by id', async () => {
        const user = await createUserUseCase.execute({
            name: 'Teste',
            email: 'teste@rocketseat.com',
            password: '123456',
        });

        const statement = await createStatementUseCase.execute({
            user_id: user.id,
            amount: 100,
            description: 'Deposit',
            type: OperationType.DEPOSIT,
        })

        const { amount } = await getStatementOperationUseCase.execute({
            statement_id: statement.id,
            user_id: user.id,
        })

        expect(amount).toBe(100);
    })
})