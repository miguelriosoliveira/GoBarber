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
		const day = 20;
		const month = 5; // may
		const year = 2020;

		// filling the day with appointments

		await fakeAppointmentsRepository.create({
			provider_id,
			date: new Date(year, month - 1, day, 8),
		});

		await fakeAppointmentsRepository.create({
			provider_id,
			date: new Date(year, month - 1, day, 10),
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
				{ hour: 9, available: true },
				{ hour: 10, available: false },
				{ hour: 11, available: true },
			]),
		);
	});
});
