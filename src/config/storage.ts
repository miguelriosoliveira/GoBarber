import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';
import path from 'path';

interface IStorageConfig {
	driver: 'disk' | 's3';

	tmpFolder: string;
	uploadsFolder: string;

	multer: {
		storage: StorageEngine;
	};

	config: {
		disk: unknown;
		s3: {
			bucket: string;
		};
	};
}

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

const storageConfig: IStorageConfig = {
	driver: process.env.STORAGE_DRIVER || 'disk',

	tmpFolder,
	uploadsFolder: path.resolve(tmpFolder, 'uploads'),

	multer: {
		storage: multer.diskStorage({
			destination: tmpFolder,
			filename(_request, file, callback) {
				const fileHash = crypto.randomBytes(10).toString('hex');
				const filename = `${fileHash}-${file.originalname}`;
				return callback(null, filename);
			},
		}),
	},

	config: {
		disk: {},
		s3: {
			bucket: 'app-gobarber',
		},
	},
};

export default storageConfig;
