import aws from 'aws-sdk';
import { Transporter, createTransport } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import mailConfig from '@config/mail';

import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class SESMailProvider implements IMailProvider {
	private client: Transporter;

	constructor(
		@inject('MailTemplateProvider')
		private mailTemplateProvider: IMailTemplateProvider,
	) {
		this.client = createTransport({
			SES: new aws.SES({
				apiVersion: '2010-12-01',
				region: process.env.AWS_DEFAULT_REGION,
			}),
		});
	}

	public async sendMail({ from, to, subject, templateData }: ISendMailDTO): Promise<void> {
		this.client.sendMail({
			from: {
				name: from?.name || mailConfig.defaults.from,
				address: from?.email || mailConfig.defaults.name,
			},
			to: {
				name: to.name,
				address: to.email,
			},
			subject,
			html: await this.mailTemplateProvider.parse(templateData),
		});
	}
}
