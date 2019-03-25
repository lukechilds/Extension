# Browser extension to show user influence on Crypto Twitter.

![](https://i.imgur.com/mDgZ9gW.png)

It is hard to tell, which Twitter accounts are truly influential. This extension displays influence scores directly on Twitter profiles.

These are the same scores as available on [Hive.one](https://hive.one). You can choose to display scores for the Crypto Twitter or specific sub-clusters, such as BTC or ETH.


## Install

*We recommend installing using Chrome store, but here are instructions if you'd like to build and install it manually.*

```
npm install
```

## Run in developer environment

1. Run:

```
npm run dev
```

2. Go to `chrome://extensions`
3. Click "Load unpacked"
4. Choose `build` directory created by Webpack inside project directory


## Production build

Run:
```
npm run build
```