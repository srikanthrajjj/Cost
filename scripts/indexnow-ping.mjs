/**
 * Submit priority URLs to IndexNow (Bing and partners).
 * Usage: node --experimental-strip-types scripts/indexnow-ping.mjs
 * Or: npm run indexnow (if wired in package.json)
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SITE = "https://www.costreno.com";
const KEY = "costreno-indexnow-7f3a9c2e8b14";

const PRIORITY_PATHS = [
  "/",
  "/estimate",
  "/quote-analyzer",
  "/compare-quotes",
  "/methodology",
  "/guides",
  "/guides/how-to-read-a-contractor-quote",
  "/guides/questions-before-signing",
  "/guides/inflated-quote-signs",
  "/guides/roof-replacement",
  "/guides/kitchen-remodel",
  "/guides/bathroom-remodel",
  "/locations",
  "/llms.txt",
];

async function main() {
  // Keep key file in sync with KEY
  const keyPath = resolve(process.cwd(), `public/${KEY}.txt`);
  const onDisk = readFileSync(keyPath, "utf8").trim();
  if (onDisk !== KEY) {
    console.error(`IndexNow key mismatch. Expected ${KEY} in ${keyPath}`);
    process.exit(1);
  }

  const urlList = PRIORITY_PATHS.map((p) => (p === "/" ? `${SITE}/` : `${SITE}${p}`));
  const payload = {
    host: "www.costreno.com",
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  console.log(`IndexNow status: ${res.status}`);
  if (res.status === 200 || res.status === 202) {
    console.log(`Submitted ${urlList.length} URLs.`);
  } else {
    const text = await res.text().catch(() => "");
    console.error(text || "Submission failed");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
