import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
	name: string;
	email: string;
	password: string;
}

class CreateUserService {
	constructor(private usersRepository: IUsersRepository) {}

	public async execute({ name, email, password }: IRequest): Promise<User> {
		const userExists = await this.usersRepository.findByEmail(email);
		if (userExists) {
			throw new AppError('E-mail already used');
		}

		const hashedPassword = await hash(password, 8);
		const newUser = await this.usersRepository.create({ name, email, password: hashedPassword });

		return newUser;
	}
}

export default CreateUserService;
