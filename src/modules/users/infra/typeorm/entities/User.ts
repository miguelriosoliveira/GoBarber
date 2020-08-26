import { Exclude, Expose } from 'class-transformer';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

import storageConfig from '@config/storage';

@Entity('users')
export default class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	@Exclude()
	password: string;

	@Column()
	avatar: string;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@Expose({ name: 'avatar_url' })
	getAvatarUrl(): string | null {
		if (!this.avatar) {
			return null;
		}

		const urlByDriver = {
			disk: `${process.env.APP_API_URL}/files/${this.avatar}`,
			s3: `https://${storageConfig.config.s3.bucket}.s3.amazonaws.com/${this.avatar}`,
		};

		return urlByDriver[storageConfig.driver] || null;
	}
}
