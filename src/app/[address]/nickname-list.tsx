'use server';

import React from 'react';
import { getNicknamesByAddress } from './actions';

export default async function NicknameList() {
  const nicknames = await getNicknamesByAddress(
    '0x8A37ab849Dd795c0CA1979b7fcA24F90Be95d618'
  );
  return (
    <>
      {nicknames.map((nickname) => (
        <div key={nickname.id}>{nickname.value}</div>
      ))}
    </>
  );
}
