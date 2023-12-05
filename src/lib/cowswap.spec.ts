import { describe, expect, it } from 'vitest';
import { getQuote } from './cowswap';

describe('CowSwap Helpers', () => {
  it('should get a quote on mainnet', async () => {
    const q = await getQuote({
      chainId: 1,
      from: '0x8A37ab849Dd795c0CA1979b7fcA24F90Be95d618',
      receiver: '0x8A37ab849Dd795c0CA1979b7fcA24F90Be95d618',
      sellToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      buyToken: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
      kind: 'sell',
      amount: '1000000000000000000',
    });
    console.log(q);
    expect(q).toBeDefined();
    expect(q).toMatchObject({
      expiration: expect.any(String),
      from: '0x8a37ab849dd795c0ca1979b7fca24f90be95d618',
      id: expect.any(Number),
      quote: {
        sellToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        buyToken: '0x6c3ea9036406852006290770bedfcaba0e23a0e8',
        receiver: '0x8a37ab849dd795c0ca1979b7fca24f90be95d618',
        sellAmount: expect.stringMatching(/^\d+$/),
        buyAmount: expect.stringMatching(/^\d+$/),
        validTo: expect.any(Number),
        appData:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        feeAmount: expect.stringMatching(/^\d+$/),
        kind: 'sell',
        partiallyFillable: false,
        sellTokenBalance: 'erc20',
        buyTokenBalance: 'erc20',
        signingScheme: 'eip712',
      },
    });
  }, 10000);

  it('should get a quote on goerli', async () => {
    const q = await getQuote({
      chainId: 5,
      from: '0x8A37ab849Dd795c0CA1979b7fcA24F90Be95d618',
      receiver: '0x8A37ab849Dd795c0CA1979b7fcA24F90Be95d618',
      sellToken: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
      buyToken: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
      kind: 'sell',
      amount: '1000000000000000000',
    });
    expect(q).toBeDefined();
    expect(q).toMatchObject({
      expiration: expect.any(String),
      from: '0x8a37ab849dd795c0ca1979b7fca24f90be95d618',
      id: expect.any(Number),
      quote: {
        sellToken: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
        buyToken: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        receiver: '0x8a37ab849dd795c0ca1979b7fca24f90be95d618',
        sellAmount: expect.stringMatching(/^\d+$/),
        buyAmount: expect.stringMatching(/^\d+$/),
        validTo: expect.any(Number),
        appData:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        feeAmount: expect.stringMatching(/^\d+$/),
        kind: 'sell',
        partiallyFillable: false,
        sellTokenBalance: 'erc20',
        buyTokenBalance: 'erc20',
        signingScheme: 'eip712',
      },
    });
  }, 10000);
});
