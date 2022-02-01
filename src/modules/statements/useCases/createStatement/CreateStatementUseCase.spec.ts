import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe('Get Balance', () => {

    beforeEach(() => {
        statementsRepositoryInMemory = new InMemoryStatementsRepository();
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase(
            usersRepositoryInMemory,
            statementsRepositoryInMemory,
        );
        getBalanceUseCase = new GetBalanceUseCase(
            statementsRepositoryInMemory,
            usersRepositoryInMemory,
        );
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    })

    it('should create a new deposit statement', async () => {
        const user = await createUserUseCase.execute({
            name: 'Teste',
            email: 'teste@rocketseat.com',
            password: '123456',
        });

        await createStatementUseCase.execute({
            amount: 100,
            description: 'Deposit',
            type: OperationType.DEPOSIT,
            user_id: user.id
        })

        const { balance } = await getBalanceUseCase.execute({ user_id: user.id });

        expect(balance).toBe(100);
    })

    it('should create a new withdraw statement when user have balance', async () => {
        const user = await createUserUseCase.execute({
            name: 'Teste',
            email: 'teste@rocketseat.com',
            password: '123456',
        });

        await createStatementUseCase.execute({
            amount: 100,
            description: 'Deposit',
            type: OperationType.DEPOSIT,
            user_id: user.id
        })

        await createStatementUseCase.execute({
            amount: 50,
            description: 'Withdraw',
            type: OperationType.WITHDRAW,
            user_id: user.id
        })

        const { balance } = await getBalanceUseCase.execute({ user_id: user.id });

        expect(balance).toBe(50);
    })

    it('should not create a new withdraw statement when user dont have balance', () => {
        expect(async () => {
            const user = await createUserUseCase.execute({
                name: 'Teste',
                email: 'teste@rocketseat.com',
                password: '123456',
            });

            await createStatementUseCase.execute({
                amount: 100,
                description: 'Deposit',
                type: OperationType.DEPOSIT,
                user_id: user.id
            })

            await createStatementUseCase.execute({
                amount: 200,
                description: 'Withdraw',
                type: OperationType.WITHDRAW,
                user_id: user.id
            })
        }).rejects.toBeInstanceOf(AppError);
    })

})