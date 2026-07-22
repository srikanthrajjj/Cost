import { writeFileSync, statSync } from "node:fs";
import { buildSitemapXml } from "../src/lib/sitemap.ts";

const xml = buildSitemapXml();
writeFileSync("public/sitemap.xml", xml);
console.log("wrote", statSync("public/sitemap.xml").size);
console.log(xml.slice(0, 400));
