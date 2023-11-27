import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { POST } from './route';
import { createMocks, createRequest } from 'node-mocks-http';
import { NextRequest } from 'next/server';
import { migrator } from '@/app/_db/migrate';
import { NO_MIGRATIONS } from 'kysely';

describe('Nickname API', () => {
  beforeEach(async () => {
    await migrator.migrateToLatest();
  });

  afterEach(async () => {
    await migrator.migrateTo(NO_MIGRATIONS);
  });

  describe('POST', () => {
    it('creates a new nickname', async () => {
      var enc = new TextEncoder(); // always utf-8

      const req = createRequest({
        url: 'http://example.com/api/edge-function-example',
        method: 'POST',
        body: {
          nickname: 'bar',
          address: '0x1234567812345678123456781234567812345678',
        },
      });
      const response = await POST(req);
      expect(response).toMatchObject({
        status: 201,
      });
      expect(await response.json()).toMatchObject({
        id: 1,
        value: 'bar',
      });
    });

    ['foo', 'bar', 'baz', '🚗hello', 'èïð'].forEach((nickname) => {
      it(`creates nickname ${nickname}`, async () => {
        const address = '0x1234567812345678123456781234567812345678';
        var enc = new TextEncoder(); // always utf-8

        const req = createRequest({
          url: 'http://example.com/api/edge-function-example',
          method: 'POST',
          body: {
            nickname,
            address,
          },
        });
        const response = await POST(req);
        expect(response).toMatchObject({
          status: 201,
        });
        expect(await response.json()).toMatchObject({
          id: 1,
          value: nickname,
        });
      });
    });
  });
});
