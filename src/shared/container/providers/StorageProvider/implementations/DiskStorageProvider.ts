import fs from 'fs';
import path from 'path';

import storageConfig from '@config/storage';

import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
	public async saveFile(file: string): Promise<string> {
		await fs.promises.rename(
			path.resolve(storageConfig.tmpFolder, file),
			path.resolve(storageConfig.uploadsFolder, file),
		);

		return file;
	}

	public async deleteFile(file: string): Promise<void> {
		const filePath = path.resolve(storageConfig.uploadsFolder, file);

		try {
			await fs.promises.stat(filePath);
		} catch {
			return;
		}

		await fs.promises.unlink(filePath);
	}
}

export default DiskStorageProvider;
