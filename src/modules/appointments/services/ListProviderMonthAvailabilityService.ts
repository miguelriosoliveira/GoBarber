import { getDaysInMonth } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
	provider_id: string;
	month: number;
	year: number;
}

type IResponse = Array<{
	day: number;
	available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabityService {
	constructor(
		@inject('AppointmentsRepository')
		private appointmentsRepository: IAppointmentsRepository,
	) {}

	public async execute({ provider_id, month, year }: IRequest): Promise<IResponse> {
		const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
			provider_id,
			month,
			year,
		});

		const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

		const eachDayArray = Array.from(
			{
				length: numberOfDaysInMonth,
			},
			(value, index) => index + 1,
		);

		const currentDate = new Date(Date.now());

		const availability = eachDayArray.map(day => {
			const appointmentsInDay = appointments.filter(appointment => {
				return appointment.date.getDate() === day;
			});

			const dayDate = new Date(year, month - 1, day);

			return {
				day,
				available: appointmentsInDay.length < 10 && dayDate >= currentDate,
			};
		});

		return availability;
	}
}
