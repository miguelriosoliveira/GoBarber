import { compare } from 'bcryptjs';
import { getRepository } from 'typeorm';

import User from '../models/User';

interface Request {
	email: string;
	password: string;
}

class AuthenticateUserService {
	public async execute({ email, password }: Request): Promise<User> {
		const usersRepository = getRepository(User);

		const user = await usersRepository.findOne({ where: { email } });
		if (!user) {
			throw new Error('Incorrect email/password combination');
		}

		const passwordMatch = await compare(password, user.password);
		if (!passwordMatch) {
			throw new Error('Incorrect email/password combination');
		}

		return user;
	}
}

export default AuthenticateUserService;
