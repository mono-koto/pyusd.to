'use server';

import { networkDependentConfig } from '@/config';
import { gql, request } from 'graphql-request';
import { Address, PublicClient } from 'viem';

interface PoolsResponse {
  pools: Array<{ id: Address }>;
}

export async function uniswapV3Pools(chainId: number, token: string) {
  const uniswapV3SubgraphURL =
    networkDependentConfig[chainId].uniswapV3SubgraphURL;

  const q = gql`
    query getPools($token: String!) {
      pools(where: { or: [{ token0: $token }, { token1: $token }] }) {
        id
      }
    }
  `;
  const variables = {
    token: token.toLowerCase(),
  };
  const response = await request<PoolsResponse>(
    uniswapV3SubgraphURL,
    q,
    variables
  );
  return response.pools.map((pool) => pool.id);
}

export async function tokenSwaps(
  client: PublicClient,
  token: Address,
  options?: {
    maxBlocks?: bigint;
    maxSwaps?: bigint;
    blocksPerQuery?: bigint;
  }
) {
  const maxSwaps = options?.maxSwaps ?? 100n;

  const pools = await uniswapV3Pools(client.chain?.id || 1, token);

  const logGenerator = iterateLogQuery(
    client,
    {
      address: token,
      event: {
        name: 'Transfer',
        type: 'event',
        inputs: [
          { type: 'address', indexed: true, name: 'from' },
          { type: 'address', indexed: true, name: 'to' },
          { type: 'uint256', indexed: false, name: 'value' },
        ],
      },
      args: {
        from: pools,
        //   to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac',
      },
    },
    options
  );
  let foundLogs;

  for await (const logBatch of logGenerator) {
    if (!foundLogs) {
      foundLogs = logBatch.logs;
    } else {
      foundLogs = foundLogs.concat(logBatch.logs);
    }
    if (foundLogs.length >= maxSwaps) {
      break;
    }
  }
  foundLogs = foundLogs?.slice(0, Number(maxSwaps)) || [];

  type TransferEvent = {
    from: string;
    to: string;
    value: bigint;
  };
  return foundLogs.map((log) => ({
    ...(log as any as { args: TransferEvent }).args,
    blockNumber: log.blockNumber,
    blockHash: log.blockHash,
    transactionHash: log.transactionHash,
  }));
}

export async function* iterateLogQuery<T>(
  client: PublicClient,
  logsQuery: T,
  options?: {
    maxBlocks?: bigint;
    blocksPerQuery?: bigint;
  }
) {
  const maxBlocks = options?.maxBlocks ?? 10000n;
  const blocksPerQuery = options?.blocksPerQuery ?? 100n;

  const latest = await client.getBlock();

  const floorBlock = latest.number - maxBlocks;
  for (
    let toBlock = latest.number;
    toBlock > floorBlock;
    toBlock -= blocksPerQuery
  ) {
    let fromBlock = toBlock - blocksPerQuery;
    if (fromBlock < floorBlock) {
      fromBlock = floorBlock;
    }
    const logs = await client.getLogs({
      ...logsQuery,
      fromBlock,
      toBlock,
    });
    yield {
      logs,
      fromBlock,
      toBlock,
    };
  }
}
