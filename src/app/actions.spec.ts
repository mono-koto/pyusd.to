import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { tokenSwaps, uniswapV3Pools } from './actions';
import { mainnet } from 'wagmi';
import dotenv from 'dotenv';
import { createPublicClient, http } from 'viem';
dotenv.config();

console.log(process.env.VITE_ALCHEMY_API_KEY);

describe.only('base app actions', () => {
  it('gets uniswap pools', async () => {
    const response = await uniswapV3Pools(
      1,
      '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8'
    );
    console.log(response);
    expect(response).toMatchObject([
      '0x13394005c1012e708fce1eb974f1130fdc73a5ce',
      '0x26d4c30a6b203911c7e435953d77c826ae254377',
      '0x643ea0885875a77bf8dc3e0f3ead866a125276b1',
      '0xa8b1a6acc942b8266f987c4b0cdf625e3479a26b',
      '0xaa4c9d6e5e349f319abb625aa8dca5f52abea757',
      '0xc30c8b862f7de6ba5d7eaeb113c78ec6b5ded04b',
      '0xd3f5c377a8506af29aeafbc90d1e5c6534f197b4',
      '0xf313d711d71eb9a607b4a61a827a9e32a7846621',
    ]);
  });

  it('gets logs of swaps', async () => {
    const client = createPublicClient({
      chain: mainnet,
      transport: http(
        `https://eth-mainnet.alchemyapi.io/v2/${process.env.VITE_ALCHEMY_API_KEY}`
      ),
    });
    const logs = await tokenSwaps(
      client,
      '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
      {
        maxBlocks: 100000n,
        maxSwaps: 100n,
        blocksPerQuery: 100000n,
      }
    );
    console.log(logs);
  }, 20000);
});
