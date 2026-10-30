// Small copies of the author busts for the home page's strip of medallions, which shows them 60px tall.
// Run with `npm run thumbs` after adding a bust to public/authors.
import {mkdirSync, readdirSync} from "node:fs";
import sharp from "sharp";

const SOURCE = "public/authors";
const TARGET = `${SOURCE}/thumbs`;

mkdirSync(TARGET, {recursive: true});
const files = readdirSync(SOURCE).filter((file) => file.endsWith(".webp"));
for (const file of files) {
    await sharp(`${SOURCE}/${file}`).resize({height: 160, withoutEnlargement: true}).webp({quality: 78}).toFile(`${TARGET}/${file}`);
}
console.log(`Wrote ${files.length} thumbnails to ${TARGET}.`);
