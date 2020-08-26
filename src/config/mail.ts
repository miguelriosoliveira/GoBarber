interface IMailConfig {
	driver: 'ethereal' | 'ses';
	defaults: {
		from: string;
		name: string;
	};
}

const mailConfig: IMailConfig = {
	driver: process.env.MAIL_DRIVER || 'ethereal',
	defaults: {
		from: 'miguel@rios.com',
		name: 'Miguel Rios falando',
	},
};

export default mailConfig;
