"use client";

// import { useWeb3Info } from "../../hooks/useWeb3Info";
// import { JsonContent } from "../../components/jsonContent";
// import { useCurrentChainId } from "../../hooks/useCurrentChainId";
// import { ResultContent } from "../../components/resultContent";

// const orderBookApi = new OrderBookApi();
// const chainId = 1;

export function GetQuotePage() {
  // const account = "0x8A37ab849Dd795c0CA1979b7fcA24F90Be95d618";

  // const input: OrderQuoteRequest = {
  //   sellToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  //   buyToken: "0x6c3ea9036406852006290770bedfcaba0e23a0e8",
  //   from: account,
  //   receiver: account,
  //   buyAmountAfterFee: (100 * 10 ** 6).toString(),
  //   kind: OrderQuoteSideKindBuy.BUY,
  //   // sellAmountBeforeFee: (0.1 * 10 ** 18).toString(),
  //   // kind: OrderQuoteSideKindSell.SELL,
  // };

  // const quote = useQuote(input);
  // console.log(quote);

  // console.log(input);

  // useEffect(() => {
  //   orderBookApi.context.chainId = chainId;
  // }, [chainId]);

  // const getQuote = useCallback(
  //   (event: FormEvent) => {
  //     event.preventDefault();

  //     if (!input) return;

  //     setOutput("Loading...");

  //     orderBookApi
  //       .getQuote(input)
  //       .then((output) => {
  //         console.log(output);
  //         setOutput(output);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         setOutput(error.toString());
  //       });
  //   },
  //   [input]
  // );

  return (
    <div>
      <div className='whitespace-pre'>
        {/* <div>{JSON.stringify(quote)}</div> */}
      </div>
    </div>
  );
}
