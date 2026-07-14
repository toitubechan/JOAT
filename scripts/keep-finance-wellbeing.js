/**
 * Revert the content library to ONLY Money & Finance + Mindfulness & Mental
 * Wellbeing (the original, good-quality categories). Removes every other
 * category's lessons + their generated images + their registrations.
 *
 * Keeps: any lesson whose frontmatter `category` is one of KEEP_CATS, the image
 * keys those lessons reference, all UI icons / mascots, and the money +
 * mindfulness category heroes. Deletes everything else.
 *
 *   node scripts/keep-finance-wellbeing.js          # dry run (reports, deletes nothing)
 *   node scripts/keep-finance-wellbeing.js --write  # actually delete + deregister
 *
 * After --write, run:  node scripts/build-content.js
 * to regenerate lessons.generated.ts + categories.ts from what remains.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "content");
const IMAGES_TS = path.join(ROOT, "src", "constants", "images.ts");

const KEEP_CATS = new Set(["Money & Finance", "Mindfulness & Mental Wellbeing"]);
const KEEP_CAT_HEROES = new Set(["catMoneyHero", "catMindfulnessHero"]);
const WRITE = process.argv.includes("--write");

const importRe = /^import\s+(\w+)\s+from\s+["']([^"']+)["'];?\s*$/;

function main() {
  // 1) Partition content by category; collect image keys the keepers reference.
  const files = fs.readdirSync(CONTENT).filter((f) => f.endsWith(".md"));
  const removeContent = [];
  const keepKeys = new Set();
  let keepContent = 0;
  for (const f of files) {
    const t = fs.readFileSync(path.join(CONTENT, f), "utf8");
    const cat = (t.match(/^category:\s*(.+)$/m) || [])[1]?.trim();
    if (KEEP_CATS.has(cat)) {
      keepContent += 1;
      [...t.matchAll(/^image:\s*(.+)$/gm)].forEach((m) => keepKeys.add(m[1].trim()));
    } else {
      removeContent.push(f);
    }
  }

  // 2) Walk constants/images.ts imports; decide which keys/files to drop.
  const lines = fs.readFileSync(IMAGES_TS, "utf8").split(/\r?\n/);
  const removeKeys = new Set();
  const removeFiles = [];
  for (const line of lines) {
    const m = importRe.exec(line);
    if (!m) continue;
    const [, key, p] = m;
    const abs = path.resolve(path.dirname(IMAGES_TS), p);
    if (p.includes("/lessons/")) {
      if (!keepKeys.has(key)) {
        removeKeys.add(key);
        removeFiles.push(abs);
      }
    } else if (/cat-[\w-]*-hero/.test(p)) {
      if (!KEEP_CAT_HEROES.has(key)) {
        removeKeys.add(key);
        removeFiles.push(abs);
      }
    }
  }

  console.log("KEEP:", keepContent, "lessons |", keepKeys.size, "image keys");
  console.log("REMOVE:", removeContent.length, "lesson markdown files");
  console.log("REMOVE:", removeKeys.size, "image registrations +", removeFiles.length, "image files");

  if (!WRITE) {
    console.log("\nDry run — nothing deleted. Re-run with --write to apply.");
    return;
  }

  // 3) Rewrite images.ts: drop the removed imports + their object entries.
  const out = lines.filter((line) => {
    const im = importRe.exec(line);
    if (im && removeKeys.has(im[1])) return false;
    const entry = /^\s*(\w+),\s*$/.exec(line);
    if (entry && removeKeys.has(entry[1])) return false;
    return true;
  });
  fs.writeFileSync(IMAGES_TS, out.join("\n"));

  // 4) Delete the image files and the removed lesson markdown.
  let imgDeleted = 0;
  for (const f of removeFiles) {
    if (fs.existsSync(f)) {
      fs.unlinkSync(f);
      imgDeleted += 1;
    }
  }
  for (const f of removeContent) fs.unlinkSync(path.join(CONTENT, f));

  console.log(`\nDone. Deleted ${imgDeleted} images + ${removeContent.length} lessons; deregistered ${removeKeys.size} keys.`);
  console.log("Next: node scripts/build-content.js");
}

main();
