// Writes public/sitemap.xml from the catalogue in src/data: the main pages, every book and every author. Run with
// `npm run sitemap` after adding books (or authors) so search engines find them; the file is committed.
import {mkdirSync, rmSync, writeFileSync} from "node:fs";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";
import {build} from "rolldown";

const SITE = "https://folio-mu-peach.vercel.app";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tmp = join(root, "node_modules", ".tmp", "sitemap");
mkdirSync(tmp, {recursive: true});
await build({
    input: {authors: join(root, "src/data/authors.ts"), books: join(root, "src/data/books.ts")},
    resolve: {alias: {"@": join(root, "src")}},
    output: {dir: tmp, format: "esm", entryFileNames: "[name].mjs"},
    logLevel: "silent",
});
const {AUTHORS} = await import(pathToFileURL(join(tmp, "authors.mjs")).href);
const {BOOKS} = await import(pathToFileURL(join(tmp, "books.mjs")).href);
rmSync(tmp, {recursive: true, force: true});

const today = new Date().toISOString().slice(0, 10);
const entry = (path, priority) => `  <url><loc>${SITE}${path}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`;
const urls = [
    entry("/", "1.0"),
    entry("/books", "0.9"),
    entry("/authors", "0.8"),
    ...["philosophy", "history", "psychology", "literature"].map((category) => entry(`/books?category=${category}`, "0.7")),
    ...BOOKS.map((book) => entry(`/books/${book.id}`, "0.8")),
    ...AUTHORS.map((author) => entry(`/authors/${author.id}`, "0.6")),
    entry("/privacy", "0.2"),
    entry("/terms", "0.2"),
];
// "&" in query strings must be escaped in XML; the category links have none, but keep the file valid if one is added.
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n").replace(/&(?!amp;)/g, "&amp;")}\n</urlset>\n`;
writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(`Wrote public/sitemap.xml: ${urls.length} pages.`);
