import { db } from './db';
import { Address } from './types';

export async function findAddressById(id: number) {
  return await db
    .selectFrom('address')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();
}

export async function findAddress(address: string) {
  return await db
    .selectFrom('address')
    .where('value', '=', address)
    .selectAll()
    .executeTakeFirst();
}

export async function createAddress(address: string) {
  return await db
    .insertInto('address')
    .values({
      value: address,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function createOrFindAddress(address: string) {
  try {
    return await createAddress(address.toLowerCase());
  } catch (error) {
    let message = (error as any).message;
    if (
      message &&
      message ===
        'duplicate key value violates unique constraint "address_value_key"'
    ) {
      return (await findAddress(address)) as Address;
    } else {
      throw error;
    }
  }
}
