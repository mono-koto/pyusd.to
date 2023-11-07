import { OrderBookApi, OrderQuoteRequest } from "@cowprotocol/cow-sdk";
import { useMemo } from "react";
import { useChainId, useQuery } from "wagmi";

type QuoteOptions = OrderQuoteRequest;

export function useQuote(options: QuoteOptions) {
  const chainId = useChainId();
  const orderBookApi = useMemo(
    () => new OrderBookApi({ chainId: chainId }),
    [chainId]
  );

  return useQuery(["cowswap-get-quote", chainId, options], {
    queryFn: () => orderBookApi.getQuote(options),
  });
}

// export function useQuoteStuff() {
//   const account = "0x8A37ab849Dd795c0CA1979b7fcA24F90Be95d618";

//   // const [input, setInput] = useState<OrderQuoteRequest | null>(null);
//   const [output, setOutput] = useState<OrderQuoteResponse | string>("");

//   const input: OrderQuoteRequest = {
//     sellToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
//     buyToken: "0x6c3ea9036406852006290770bedfcaba0e23a0e8",
//     from: account,
//     receiver: account,
//     buyAmountAfterFee: (100 * 10 ** 6).toString(),
//     kind: OrderQuoteSideKindBuy.BUY,
//     // sellAmountBeforeFee: (0.1 * 10 ** 18).toString(),
//     // kind: OrderQuoteSideKindSell.SELL,
//   };

//   console.log(input);

//   useEffect(() => {
//     orderBookApi.context.chainId = chainId;
//   }, [chainId]);

//   const getQuote = useCallback(
//     (event: FormEvent) => {
//       event.preventDefault();

//       if (!input) return;

//       setOutput("Loading...");

//       orderBookApi
//         .getQuote(input)
//         .then((output) => {
//           console.log(output);
//           setOutput(output);
//         })
//         .catch((error) => {
//           console.error(error);
//           setOutput(error.toString());
//         });
//     },
//     [input]
//   );

//   // return (
//   //   <div>
//   //     <div className="form">
//   //       <div>
//   //         <h1>Order:</h1>
//   //         {JSON.stringify(input)}
//   //       </div>

//   //       <div>
//   //         <button onClick={getQuote}>Get quote</button>
//   //       </div>
//   //     </div>

//   //     {JSON.stringify(output)}
//   //   </div>
//   // );
// }
