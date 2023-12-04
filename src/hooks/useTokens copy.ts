import useConfig from './useConfig';

export function useTokens() {
  return useConfig().tokenList;
}
