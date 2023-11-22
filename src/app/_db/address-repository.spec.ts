import { db } from './db';

import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as address from './migrations/20231121T212636-address-table';

import * as AddressRepository from './address-repository';
import { migrateToLatest, migrator, reset, resetMigrations } from './migrate';
import { NO_MIGRATIONS } from 'kysely';

describe('AddressRepository', () => {
  beforeEach(async () => {
    await migrator.migrateToLatest();
  });

  afterEach(async () => {
    await migrator.migrateTo(NO_MIGRATIONS);
  });

  it('foo', () => {
    expect(true).toBe(true);
  });

  it('should create an address with a given value', async () => {
    const createdAddress = await AddressRepository.createAddress(
      '0x1234567812345678123456781234567812345678'
    );
    const foundAddress = await AddressRepository.findAddress(
      '0x1234567812345678123456781234567812345678'
    );

    expect(createdAddress).toMatchObject({
      id: 1,
      value: '0x1234567812345678123456781234567812345678',
      created_at: expect.any(Date),
    });
    expect(createdAddress!.created_at.getTime()).toBeCloseTo(
      new Date().getTime(),
      -3
    );

    expect(foundAddress).toEqual(createdAddress);
  });

  it('should create or find an address', async () => {
    const value = '0x1234567812345678123456781234567812345678';
    const createdOrFoundAddress =
      await AddressRepository.createOrFindAddress(value);
    const createdOrFoundAddress2 =
      await AddressRepository.createOrFindAddress(value);
    expect(createdOrFoundAddress2).toEqual(createdOrFoundAddress);

    const foundAddress = await AddressRepository.findAddress(value);
    expect(foundAddress).toEqual(createdOrFoundAddress);
  });

  [
    ['0xAbcdabcdabcdabcdabcdabcdabcdabcdabcdabcd', 'uppercase'],
    ['0x123456781234567812345678123456781234567', 'too short'],
    ['12345678123456781234567812345678123456789', 'no 0x prefix'],
    ['0x123456781234567812345678123456781234567g', 'invalid character'],
  ].forEach(([value, description]) => {
    it(`should fail if creating an address with ${description}`, async () => {
      await expect(async () =>
        AddressRepository.createAddress(value)
      ).rejects.toThrow(/violates check constraint/);
    });
  });

  it('should not find a non-existent address by ID', async () => {
    const foundAddress = await AddressRepository.findAddressById(100);
    expect(foundAddress).toBeUndefined();
  });

  it('should not find a non-existent address by value', async () => {
    const foundAddress = await AddressRepository.findAddress('0x100');
    expect(foundAddress).toBeUndefined();
  });
});
