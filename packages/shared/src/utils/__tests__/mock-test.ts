import { describe, it, expect, vi } from 'vitest';

// Mock from test's relative path
vi.mock('../../generated/api', () => ({
	PublicKeyExchange: vi.fn(() => Promise.resolve({ server_pub_key: 'x', key_exchange_id: 'y' })),
}));

import { PublicKeyExchange as pk } from '../../generated/api';

describe('mock test', () => {
	it('should return mock value', async () => {
		const result = await pk();
		expect(result).toEqual({ server_pub_key: 'x', key_exchange_id: 'y' });
	});
});
