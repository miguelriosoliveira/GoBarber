interface ITemplateVariables {
	[key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
	templateFile: string;
	variables: ITemplateVariables;
}
