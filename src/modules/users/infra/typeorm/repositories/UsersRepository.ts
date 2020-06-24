import { getRepository, Repository } from 'typeorm';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

class UsersRepository implements IUsersRepository {
	private ormRepository: Repository<User>;

	constructor() {
		this.ormRepository = getRepository(User);
	}

	public async findById(id: string): Promise<User | undefined> {
		return this.ormRepository.findOne(id);
	}

	public async findByEmail(email: string): Promise<User | undefined> {
		return this.ormRepository.findOne({ where: { email } });
	}

	public async create(userData: ICreateUserDTO): Promise<User> {
		const user = this.ormRepository.create(userData);
		await this.ormRepository.save(user);
		return user;
	}

	public async save(user: User): Promise<User> {
		return this.ormRepository.save(user);
	}
}

export default UsersRepository;
