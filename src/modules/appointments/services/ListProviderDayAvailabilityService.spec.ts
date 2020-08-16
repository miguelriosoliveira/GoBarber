import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderDayAvailabityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabityService;

describe('ListProviderDayAvailability', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		listProviderDayAvailability = new ListProviderDayAvailabityService(fakeAppointmentsRepository);
	});

	it('should be able to list day availability of a provider', async () => {
		// test params

		const provider_id = 'provider_id';
		const user_id = 'user_id';
		const day = 20;
		const month = 5; // may
		const year = 2020;

		// filling the day with appointments

		await fakeAppointmentsRepository.create({
			provider_id,
			user_id,
			date: new Date(year, month - 1, day, 14),
		});

		await fakeAppointmentsRepository.create({
			provider_id,
			user_id,
			date: new Date(year, month - 1, day, 15),
		});

		// mocking the current time to 11am

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			return new Date(year, month - 1, day, 11).getTime();
		});

		// getting provider's availability

		const availability = await listProviderDayAvailability.execute({
			provider_id,
			day,
			month,
			year,
		});

		// assertions

		expect(availability).toStrictEqual(
			expect.arrayContaining([
				{ hour: 8, available: false },
				{ hour: 9, available: false },
				{ hour: 10, available: false },
				{ hour: 11, available: false },
				{ hour: 12, available: true },
				{ hour: 13, available: true },
				{ hour: 14, available: false },
				{ hour: 15, available: false },
				{ hour: 16, available: true },
			]),
		);
	});
});
