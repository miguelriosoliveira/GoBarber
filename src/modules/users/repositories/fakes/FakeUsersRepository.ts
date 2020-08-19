import * as uuid from 'uuid';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
	private users: User[] = [];

	public async findAllProviders({ except_user_id }: IFindAllProvidersDTO): Promise<User[]> {
		if (except_user_id) {
			return this.users.filter(user => user.id !== except_user_id);
		}
		return this.users;
	}

	public async findById(id: string): Promise<User | undefined> {
		const userFound = this.users.find(user => user.id === id);
		return userFound;
	}

	public async findByEmail(email: string): Promise<User | undefined> {
		const userFound = this.users.find(user => user.email === email);
		return userFound;
	}

	public async create(userData: ICreateUserDTO): Promise<User> {
		const user = new User();
		Object.assign(user, { id: uuid.v4() }, userData);
		this.users.push(user);
		return user;
	}

	public async save(user: User): Promise<User> {
		let userFound = this.users.find(user_ => user_.id === user.id);
		userFound = user;
		return userFound;
	}
}

export default FakeUsersRepository;
