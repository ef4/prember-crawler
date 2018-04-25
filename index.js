const { JSDOM } = require("jsdom");
const { URL } = require('url');

module.exports = async function crawl({ startingFrom, visit, selector }) {
  if (typeof visit !== 'function') {
    throw new Error("You must provide a visit() function to crawl()");
  }
  let queue = startingFrom ? startingFrom.slice() : ['/'];
  let seen = {};
  let output = [];
  let links = selector || 'a';

  queue.forEach(queued => seen[queued] = true);

  while (queue.length > 0) {
    let url = queue.shift();
    let page = await visit(url);
    if (page.statusCode === 200) {
      output.push(url);
      let html = await page.html();
      let dom = new JSDOM(html);
      for (let aTag of [...dom.window.document.querySelectorAll(links)]) {
        if (aTag.href && !seen[aTag.href]) {
          seen[aTag.href] = true;
          let u = new URL(aTag.href, 'http://localhost');
          if (u.host === 'localhost') {
            queue.push(aTag.href);
          }
        }
      }
    }
  }
  return output;
}
