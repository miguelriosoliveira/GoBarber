import fs from 'fs';
import handlebars from 'handlebars';

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
	public async parse({ templateFile, variables }: IParseMailTemplateDTO): Promise<string> {
		const templateContent = await fs.promises.readFile(templateFile, { encoding: 'utf-8' });
		const parseTemplete = handlebars.compile(templateContent);
		return parseTemplete(variables);
	}
}
