import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
	provider_id: string;
	day: number;
	month: number;
	year: number;
}

@injectable()
export default class ListProviderAppointmentsService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppointmentsRepository,

		@inject('CacheProvider')
		private cacheProvider: ICacheProvider,
	) {}

	public async execute({ provider_id, day, month, year }: IRequest): Promise<Appointment[]> {
		const appointmentsOfTheDay = await this.appointmentsRepository.findAllInDayFromProvider({
			provider_id,
			day,
			month,
			year,
		});
		return appointmentsOfTheDay;
	}
}
