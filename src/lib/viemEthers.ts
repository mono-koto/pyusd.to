import { type WalletClient } from 'wagmi';
import { type PublicClient, getPublicClient } from '@wagmi/core';
import { providers } from 'ethers';
import { type HttpTransport } from 'viem';

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === 'fallback')
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    );
  return new providers.JsonRpcProvider(transport.url, network);
}

/** Action to convert a viem Public Client to an ethers.js Provider. */
export function getEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = getPublicClient({ chainId });
  return publicClientToProvider(publicClient);
}

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain } = walletClient;
  const transport = getPublicClient({ chainId: chain.id }).transport;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}
