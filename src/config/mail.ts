interface IMailConfig {
	driver: 'ethereal' | 'ses';
	defaults: {
		from: string;
		name: string;
	};
}

export default {
	driver: process.env.APP_MAIL_DRIVER || 'ethereal',
	defaults: {
		from: 'miguel@rios.com',
		name: 'Miguel Rios falando',
	},
} as IMailConfig;
