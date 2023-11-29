import { createOrFindAddress } from './address-repository';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import { db } from './db';

export async function findNickname(value: string) {
  return await db
    .selectFrom('nickname')
    .select((eb) => [
      'id',
      'value',
      'created_at',
      'address_id',
      jsonObjectFrom(
        eb
          .selectFrom('address')
          .select(['address.value', 'address.created_at'])
          .whereRef('nickname.address_id', '=', 'address.id')
      ).as('address'),
    ])
    .where('nickname.value', '=', value)
    .executeTakeFirst();
}

interface PaginationOptions {
  offset: number;
  limit: number;
}

export async function findNicknamesByAddress(
  addressValue: string,
  paginationOptions: Partial<PaginationOptions> = {}
) {
  const pagination = {
    offset: 0,
    limit: 100,
    ...paginationOptions,
  };

  return await db
    .selectFrom('nickname')
    .innerJoin('address', 'address.id', 'nickname.address_id')
    .where('address.value', 'ilike', addressValue)
    .selectAll('nickname')
    .offset(pagination.offset)
    .limit(pagination.limit)
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
