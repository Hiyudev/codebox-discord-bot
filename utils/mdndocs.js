const fetch = require("node-fetch");
const { XMLParser } = require("fast-xml-parser");
const { gunzipSync } = require("zlib");
const flexsearch = require("flexsearch");

const MDN = "https://developer.mozilla.org/en-US/docs/";

async function searchMDN(query) {
  const res = await fetch(
    "https://developer.mozilla.org/sitemaps/en-us/sitemap.xml.gz"
  );
  if (!res.ok) {
    throw new Error("Something wrong happend!");
  }

  const parsedSitemap = new XMLParser().parse(
    gunzipSync(await res.buffer()).toString()
  );
  const sitemap = parsedSitemap.urlset.url.map((entry) => ({
    loc: entry.loc.slice(MDN.length),
    url: entry.loc,
    lastmod: new Date(entry.lastmod).valueOf(),
  }));

  const index = new flexsearch.Index();
  sitemap.forEach((entry, idx) => index.add(idx, entry.loc));

  sources = { index, sitemap, lastUpdated: Date.now() };

  const search = index.search(query, { limit: 25 }).map((id) => {
    return {
      url: sitemap[id].url,
      loc: sitemap[id].loc,
    };
  });

  return search;
}

module.exports = searchMDN;
