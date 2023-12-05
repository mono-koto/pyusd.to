# pyusd.to

## What is this?

This is the repo for PYUSD.to, open source dapp that makes it easy to receive PYUSD from any ETH address, converted from most popular tokens via a swap.

PayPal users can generate a PYUSD receiving address via the PayPal mobile app or website, enter the address, and even create and share a custom URL, e.g. https://pyusd.to/b

ENS and addresses work fine as well, e.g. https://pyusd.to/mono-koto.eth

All swaps are via Uniswap V3.

## Why?

This project explores a few exciting emerging developments.

PayPal's release of its PYUSD ERC-20 effectively opens up its multi-sided web2 commerce network to the Ethereum web3 network. Anyone with a crypto wallet can now pay a PayPal user via PYUSD, using readymade web3 wallets, composed with DeFi protocols, and all leveraging Ethereum's transparency and security.

Another way to think of it: PYUSD has the potential to be "the people's fiat-backed stable," with the peg security of protocols like USDC, but accessible on/off-ramp liquidity available to millions of users.

## Implementation Notes and Limitations

This is an exploratory proof of concept focused on user-friendly experiences that leverage PYUSD. If and when the PYUSD team adds more capabilities, much of this process could be streamlined or even obviated!

We initially built this as a standalone frontend-only dapp, but when we decided to add the custom URL feature we migrated it to a NextJS fullstack app. Much of this could still be run as a static app by removing the backend calls and adjusting the URL paths to use `#` prefixes.

Routing is all via Uniswap's AlphaRouter, which is unfortunately slow when run client-side and without a shared cache. We've [tweaked the default config](src/lib/uniswap.ts) to scope the routing search, but it would run faster if deployed on its own.

We spiked out other routing and swap options, including aggregators like UniswapX, 1Inch, and CowSwap. We had to rule out 1inch because it lacks a simple mechanism to specify a buy amount. UniswapX's documentation was unfortunately lacking. CowSwap is actually a very close fit, and could be totally gasless for permit-supporting ERC-20s, and we were able to fetch quotes easily, but we ran out of time getting it fully functional, and its documentation is out of date (undergoing an overhaul currently). Also it required a ETH->WETH wrap step (since its ETH routing is not currently documented), which added yet more gas.

As always with L1, gas cost is a major issue for simple operations like this, and is prohibitively expensive for small transactions.

# Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment

Copy `.env.template` to `.env` and fill in your own values. If running a local database per instructions below, you can ignore the database variables.

### Running the database locally

1. Install docker.

2. Pull postgresql:

   ```
   docker pull postgres
   ```

3. Run postgres:

   One option is to run it as a daemon:

   ```
   docker volume create fluffy-db
   docker run --name fluffy-db \
     -d -p 5432:5432 \
     -e POSTGRES_PASSWORD=postgres \
     -e TZ=America/Los_Angeles \
     -v fluffy-db:/var/lib/postgresql/data
     postgres
   ```

   To reset:

   ```
   docker stop fluffy-db
   docker rm fluffy-db
   docker volume rm fluffy-db
   ```

   Alternatively, run it in the foreground without a persistent volume:

   ```
   docker run \
     --rm \
     --name fluffy-db \
     -p 5432:5432 \
     -e POSTGRES_PASSWORD=postgres \
     -e TZ=America/Los_Angeles \
     postgres
   ```

## Testing

Since this project was more exploratory than production-oriented, the codebase does not have many tests other than a few spec files for the database interactions. To run those, run the database in docker as above, then use `npm test`.

## Deployment

This app is currently set up for deployment on [Vercel Platform](https://vercel.com/), and requires a PostgreSQL database for the custom URLs.
