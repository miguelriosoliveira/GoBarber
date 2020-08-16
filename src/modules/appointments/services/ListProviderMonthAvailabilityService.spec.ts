import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderMonthAvailabityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabityService;

describe('ListProviderMonthAvailability', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		listProviderMonthAvailability = new ListProviderMonthAvailabityService(
			fakeAppointmentsRepository,
		);
	});

	it('should be able to list month availability of a provider', async () => {
		// creating some appointments

		await fakeAppointmentsRepository.create({
			provider_id: 'provider_id',
			date: new Date(2020, 3, 20, 8, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'provider_id',
			date: new Date(2020, 4, 20, 8, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'provider_id',
			date: new Date(2020, 4, 20, 10, 0, 0),
		});

		await fakeAppointmentsRepository.create({
			provider_id: 'provider_id',
			date: new Date(2020, 4, 21, 8, 0, 0),
		});

		// getting provider's availability

		const availability = await listProviderMonthAvailability.execute({
			provider_id: 'provider_id',
			month: 5,
			year: 2020,
		});

		// assertions

		expect(availability).toStrictEqual(
			expect.arrayContaining([
				{ day: 19, available: true },
				{ day: 20, available: false },
				{ day: 21, available: false },
				{ day: 22, available: true },
			]),
		);
	});
});
