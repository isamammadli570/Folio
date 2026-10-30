// Builds the link-preview images (Open Graph, 1200×630 JPEG) that chat apps and social sites show when a Folio link is
// shared: public/og/default.jpg for the site, public/og/books/<id>.jpg for every book (its painting in an arched plate
// beside the title) and public/og/authors/<id>.jpg for every author with a bust. Run with `npm run og`; the images are
// committed, so the build does not need to make them. Text is in Azerbaijani, the site's default language.
import {mkdirSync, readFileSync, rmSync} from "node:fs";
import {dirname, join, resolve} from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";
import {build} from "rolldown";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tmp = join(root, "node_modules", ".tmp", "og");
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

const common = JSON.parse(readFileSync(join(root, "src/i18n/locales/AZ/common.json"), "utf8"));
const W = 1200, H = 630;
const GOLD = "#cdbb92", GOLD_DIM = "#8d7d58", INK = "#f1eee6", MUTED = "#b1ab9f";
// The cloth colours of src/index.css (--cat-*).
const CLOTH = {philosophy: "#1e2a45", history: "#5b1b26", psychology: "#1f3a2e", literature: "#4e3a1c"};
const SITE = "folio-mu-peach.vercel.app";

const esc = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const upper = (text) => text.toLocaleUpperCase("az");
const surname = (name) => name.trim().split(/\s+/).at(-1);
const year = (value) => (value < 0 ? common.years.bce.replace("{{year}}", String(-value)) : String(value));
const lifespan = (born, died) => (born < 0 && died < 0
    ? common.years.bceRange.replace("{{from}}", String(-born)).replace("{{to}}", String(-died))
    : `${year(born)} — ${year(died)}`);

/** Greedy line wrap by a rough character budget; serif capitals and Azerbaijani letters are close enough to average. */
const wrap = (text, perLine, maxLines) => {
    const lines = [];
    for (const word of text.split(/\s+/)) {
        const last = lines.at(-1);
        if (last && (last + " " + word).length <= perLine) lines[lines.length - 1] = `${last} ${word}`;
        else lines.push(word);
    }
    if (lines.length > maxLines) {
        lines.length = maxLines;
        lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[\s,.;:—-]+$/, "")}…`;
    }
    return lines;
};

const background = (cloth) => `
    <defs>
        <radialGradient id="glow" cx="30%" cy="45%" r="80%">
            <stop offset="0" stop-color="${cloth}" stop-opacity="0.95"/>
            <stop offset="0.6" stop-color="#0d0c0a" stop-opacity="0.9"/>
            <stop offset="1" stop-color="#070706"/>
        </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="#0d0c0a"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="${GOLD}" stroke-opacity="0.55" stroke-width="1.5"/>
    <rect x="32" y="32" width="${W - 64}" height="${H - 64}" fill="none" stroke="${GOLD}" stroke-opacity="0.25" stroke-width="1"/>`;

const brandLine = (x, y) => `
    <text x="${x}" y="${y}" font-family="Georgia, serif" font-size="22" letter-spacing="5" fill="${GOLD}">FOLIO · ${upper(common.brand.tagline)}</text>
    <text x="${x}" y="${y + 30}" font-family="Georgia, serif" font-size="18" fill="${MUTED}">${SITE}</text>`;

// An arched plate (round top, square foot) like the window on the book covers.
const archPath = (x, y, w, h) => `M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z`;

const plate = async (imagePath, w, h) => {
    const mask = Buffer.from(`<svg width="${w}" height="${h}"><path d="${archPath(0, 0, w, h)}" fill="#fff"/></svg>`);
    return sharp(imagePath).resize(w, h, {fit: "cover", position: "attention"}).modulate({saturation: 0.9}).composite([{input: mask, blend: "dest-in"}]).png().toBuffer();
};

const write = (svg, layers, out) =>
    sharp(Buffer.from(svg)).composite(layers).jpeg({quality: 84, mozjpeg: true}).toFile(out);

// ── Books ──
const authorById = new Map(AUTHORS.map((author) => [author.id, author]));
mkdirSync(join(root, "public/og/books"), {recursive: true});
for (const book of BOOKS) {
    const author = authorById.get(book.authorId);
    const title = wrap(book.title.az, 18, 3);
    const size = title.length === 1 ? 74 : title.length === 2 ? 66 : 56;
    const x = 520, plateW = 330, plateH = 440, plateX = 110, plateY = 95;
    const titleTop = 300 - ((title.length - 1) * size * 1.08) / 2;
    const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
        ${background(CLOTH[book.category])}
        <path d="${archPath(plateX - 12, plateY - 12, plateW + 24, plateH + 24)}" fill="none" stroke="${GOLD}" stroke-width="3"/>
        <path d="${archPath(plateX - 20, plateY - 20, plateW + 40, plateH + 40)}" fill="none" stroke="${GOLD}" stroke-opacity="0.4" stroke-width="1.2"/>
        <text x="${x}" y="150" font-family="Georgia, serif" font-size="24" letter-spacing="6" fill="${GOLD}">${esc(upper(surname(author.name.az)))}</text>
        ${title.map((line, index) => `<text x="${x}" y="${titleTop + index * size * 1.08}" font-family="Georgia, serif" font-size="${size}" fill="${INK}">${esc(line)}</text>`).join("")}
        <text x="${x}" y="${titleTop + (title.length - 1) * size * 1.08 + 62}" font-family="Georgia, serif" font-size="26" fill="${MUTED}">${esc(author.name.az)} · ${esc(year(book.year))}</text>
        <rect x="${x}" y="455" width="56" height="2" fill="${GOLD_DIM}"/>
        <text x="${x}" y="497" font-family="Georgia, serif" font-size="24" fill="${GOLD}">${esc(common.categories[book.category])} · ${book.price.toFixed(2)} ₼</text>
        ${brandLine(x, 560)}
    </svg>`;
    const image = await plate(join(root, "public", book.coverImage), plateW, plateH);
    await write(svg, [{input: image, left: plateX, top: plateY}], join(root, `public/og/books/${book.id}.jpg`));
}

// ── Authors with a bust ──
mkdirSync(join(root, "public/og/authors"), {recursive: true});
const busts = AUTHORS.filter((author) => author.portrait);
for (const author of busts) {
    const name = wrap(author.name.az, 16, 2);
    const size = name.length === 1 ? 84 : 70;
    const x = 560;
    const top = 290 - ((name.length - 1) * size) / 2;
    const quote = author.quote ? wrap(`“${author.quote.translation.az}”`, 42, 2) : [];
    const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
        ${background("#3a3426")}
        <circle cx="300" cy="300" r="225" fill="none" stroke="${GOLD}" stroke-opacity="0.5" stroke-width="2"/>
        <circle cx="300" cy="300" r="240" fill="none" stroke="${GOLD}" stroke-opacity="0.2" stroke-width="1"/>
        <text x="${x}" y="170" font-family="Georgia, serif" font-size="24" letter-spacing="6" fill="${GOLD}">${esc(upper(author.movement.az))}</text>
        ${name.map((line, index) => `<text x="${x}" y="${top + index * size}" font-family="Georgia, serif" font-size="${size}" fill="${INK}">${esc(line)}</text>`).join("")}
        <text x="${x}" y="${top + (name.length - 1) * size + 58}" font-family="Georgia, serif" font-size="28" fill="${MUTED}">${esc(lifespan(author.born, author.died))}</text>
        ${quote.map((line, index) => `<text x="${x}" y="${top + (name.length - 1) * size + 120 + index * 34}" font-family="Georgia, serif" font-style="italic" font-size="26" fill="${MUTED}">${esc(line)}</text>`).join("")}
        ${brandLine(x, 560)}
    </svg>`;
    const bust = await sharp(join(root, "public", author.portrait)).resize(470, 520, {fit: "contain", background: {r: 0, g: 0, b: 0, alpha: 0}, position: "bottom"}).png().toBuffer();
    await write(svg, [{input: bust, left: 65, top: 80}], join(root, `public/og/authors/${author.id}.jpg`));
}

// ── The site ──
const featured = ["the-republic", "crime-and-punishment", "thus-spoke-zarathustra"].map((id) => BOOKS.find((book) => book.id === id));
const plates = await Promise.all(featured.map((book) => plate(join(root, "public", book.coverImage), 220, 300)));
const siteSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    ${background("#2a2619")}
    <text x="90" y="200" font-family="Georgia, serif" font-size="24" letter-spacing="6" fill="${GOLD}">${esc(upper(common.brand.tagline))}</text>
    <text x="86" y="315" font-family="Georgia, serif" font-size="128" fill="${INK}">Folio</text>
    ${wrap("Fəlsəfə, tarix, psixologiya və ədəbiyyat klassikləri.", 34, 2).map((line, index) => `<text x="90" y="${385 + index * 40}" font-family="Georgia, serif" font-size="32" fill="${MUTED}">${esc(line)}</text>`).join("")}
    ${brandLine(90, 520)}
    ${featured.map((_, index) => `<path d="${archPath(620 + index * 175 - 8, 150 + (index % 2) * 40 - 8, 236, 316)}" fill="none" stroke="${GOLD}" stroke-width="2.5"/>`).join("")}
</svg>`;
await write(siteSvg, plates.map((image, index) => ({input: image, left: 620 + index * 175, top: 150 + (index % 2) * 40})), join(root, "public/og/default.jpg"));

console.log(`Wrote ${BOOKS.length} book, ${busts.length} author and 1 site preview into public/og.`);
