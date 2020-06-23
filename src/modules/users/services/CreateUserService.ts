import { hash } from 'bcryptjs';
import { getRepository } from 'typeorm';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

interface Request {
	name: string;
	email: string;
	password: string;
}

class CreateUserService {
	public async execute({ name, email, password }: Request): Promise<User> {
		const usersRepository = getRepository(User);

		const userExists = await usersRepository.findOne({ where: { email } });
		if (userExists) {
			throw new AppError('E-mail already used');
		}

		const hashedPassword = await hash(password, 8);
		const newUser = usersRepository.create({ name, email, password: hashedPassword });
		await usersRepository.save(newUser);

		return newUser;
	}
}

export default CreateUserService;
