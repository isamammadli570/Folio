// Smaller copies of the shipped pictures, so lists never download a picture far larger than they show it.
//   public/authors/thumbs  160px tall  the home strip of medallions and the marquee (shown 48–60px tall)
//   public/authors/md      400px tall  medallions in lists and cards (shown up to ~190px tall)
//   public/covers/thumbs   260px wide  covers in grids and drawers on phones and 1x screens (BookCover's srcset)
// Run with `npm run thumbs` after adding a bust to public/authors or a cover to public/covers.
import {mkdirSync, readdirSync} from "node:fs";
import sharp from "sharp";

const jobs = [
    {source: "public/authors", target: "public/authors/thumbs", resize: {height: 160}, quality: 78},
    {source: "public/authors", target: "public/authors/md", resize: {height: 400}, quality: 80},
    {source: "public/covers", target: "public/covers/thumbs", resize: {width: 260}, quality: 76},
];

for (const {source, target, resize, quality} of jobs) {
    mkdirSync(target, {recursive: true});
    const files = readdirSync(source).filter((file) => file.endsWith(".webp"));
    for (const file of files) {
        await sharp(`${source}/${file}`).resize({...resize, withoutEnlargement: true}).webp({quality, effort: 6}).toFile(`${target}/${file}`);
    }
    console.log(`Wrote ${files.length} pictures to ${target}.`);
}
