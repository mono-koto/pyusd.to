import { ColumnType, Generated, Insertable, Selectable } from 'kysely';

export interface Database {
  address: AddressTable;
  nickname: NicknameTable;
}

export interface AddressTable {
  id: Generated<number>;
  value: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type Address = Selectable<AddressTable>;
export type NewAddress = Insertable<AddressTable>;

export interface NicknameTable {
  id: Generated<number>;
  value: string;
  address_id: number;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type Nickname = Selectable<NicknameTable>;
export type NewNickname = Insertable<NicknameTable>;
