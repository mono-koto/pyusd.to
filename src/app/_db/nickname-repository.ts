import { createOrFindAddress } from './address-repository';
import { db } from './db';

export async function findNicknameById(id: number) {
  return await db
    .selectFrom('nickname')
    .where('id', '=', id)
    .selectAll()
    .executeTakeFirst();
}

export async function findNickname(value: string) {
  return await db
    .selectFrom('nickname')
    .where('value', '=', value)
    .selectAll()
    .executeTakeFirst();
}

export async function findNicknamesByAddressId(addressId: number) {
  return await db
    .selectFrom('nickname')
    .where('address_id', '=', addressId)
    .selectAll()
    .execute();
}

export async function findNicknamesByAddress(addressValue: string) {
  return await db
    .selectFrom('nickname')
    .innerJoin('address', 'address.id', 'nickname.address_id')
    .where('address.value', '=', addressValue)
    .selectAll('nickname')
    .limit(100)
    .orderBy('nickname.created_at', 'desc')
    .execute();
}

export async function addNickname(addressValue: string, nicknameValue: string) {
  const address = await createOrFindAddress(addressValue);

  return await db
    .insertInto('nickname')
    .values({
      value: nicknameValue,
      address_id: address.id,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}
