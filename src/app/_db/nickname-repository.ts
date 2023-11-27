import { createOrFindAddress } from './address-repository';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { db } from './db';

function findNickNameBuilder() {
  return db
    .selectFrom('nickname')
    .select((eb) => [
      'id',
      'value',
      'created_at',
      jsonObjectFrom(
        eb
          .selectFrom('address')
          .select(['address.value', 'address.created_at'])
          .whereRef('nickname.address_id', '=', 'address.id')
      ).as('address'),
    ]);
}

export async function findNicknameById(id: number) {
  return findNickNameBuilder().where('id', '=', id).executeTakeFirst();
}

export async function findNickname(value: string) {
  return await findNickNameBuilder()
    .where('nickname.value', '=', value)
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
    .where('address.value', 'ilike', addressValue)
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
