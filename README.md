# prember-crawler

A tiny web crawler that's designed to discover URLs in your app while you are pre-rendering it with [prember](https://github.com/ef4/prember).

## Quick Start

`yarn add --dev prember-crawler` or `npm install --dev prember-crawler`

And configure prember to use the crawler to discover URLs:


```
// In ember-cli-build.js
const crawl = require('prember-crawler');
let app = new EmberApp(defaults, {
  prember: {
    urls: crawl
  }
});
```

## Customizing Behavior

The `crawl` method accepts the following arguments:

 - `visit`: the function for visiting a new URL, provided by Prember. This is required.
 - `startingFrom`: list of local URLs to use as starting points for the crawl. Defaults to `['/']`.
 - `selector`: a CSS selector to use for identifying links that should be followed. Defaults to `'a'`.
 
 Putting these together, we can use `crawl` from within a customer URL-discovery function:
 
```
// In ember-cli-build.js
const crawl = require('prember-crawler');
let app = new EmberApp(defaults, {
  prember: {
    urls: async function({ visit }) {
      let productURLs = await crawl({ 
        visit, 
        startingFrom: ['/products'],
        selector: 'a.related-product'
      });
      let otherURLs = ['/about', '/contact'];
      return productURLs.concat(otherURLs);
    }
  }
});
```
 
