import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { db } from './db';
import * as address from './migrations/20231121T212636-address-table';
import * as nickname from './migrations/20231121T212732-nickname-table';
import * as NicknameRepository from './nickname-repository';
import { migrateToLatest, migrator, reset, resetMigrations } from './migrate';
import { NO_MIGRATIONS } from 'kysely';

describe('NicknameRepository', () => {
  beforeEach(async () => {
    await reset();
    await migrator.migrateToLatest();
  });

  afterEach(async () => {
    await migrator.migrateTo(NO_MIGRATIONS);
  });

  it('foo', () => {
    expect(true).toBe(true);
  });

  it('should create a nickname for an address', async () => {
    const createdNickname = await NicknameRepository.addNickname(
      '0x1234567812345678123456781234567812345678',
      'test'
    );
    expect(createdNickname).toMatchObject({
      id: 1,
      value: 'test',
      address_id: 1,
      address: '0x1234567812345678123456781234567812345678',
      created_at: expect.any(Date),
    });
  });

  it('should find nicknames by address', async () => {
    const addr = '0x1234567812345678123456781234567812345678';
    for (let i = 0; i < 3; i++) {
      await NicknameRepository.addNickname(addr, `test${i}`);
    }
    expect(await NicknameRepository.findNicknamesByAddress(addr)).toEqual([
      { id: 3, value: 'test2', address_id: 1, created_at: expect.any(Date) },
      { id: 2, value: 'test1', address_id: 1, created_at: expect.any(Date) },
      { id: 1, value: 'test0', address_id: 1, created_at: expect.any(Date) },
    ]);
  });

  it('should find a nickname by id', async () => {
    const createdNickname = await NicknameRepository.addNickname(
      '0x1234567812345678123456781234567812345678',
      'test'
    );

    const foundNickname = await NicknameRepository.findNicknameById(
      createdNickname.id
    );

    expect(foundNickname).toEqual(createdNickname);
  });
});
