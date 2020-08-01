import nodemailer, { Transporter } from 'nodemailer';

import IMailProvider from '../models/IMailProvider';

export default class EtherealMailProvider implements IMailProvider {
	private client: Transporter;

	constructor() {
		nodemailer.createTestAccount().then(account => {
			this.client = nodemailer.createTransport({
				host: account.smtp.host,
				port: account.smtp.port,
				secure: account.smtp.secure,
				auth: {
					user: account.user,
					pass: account.pass,
				},
			});
		});
	}

	public async sendMail(to: string, body: string): Promise<void> {
		const message = await this.client.sendMail({
			from: 'Equipe GoBarber <sender@example.com>',
			to,
			subject: 'Recuperação de Senha',
			text: body,
		});

		console.log('Message sent: %s', message.messageId);
		// Preview only available when sending through an Ethereal account
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
	}
}
