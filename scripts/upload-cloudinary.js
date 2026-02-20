/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { v2: cloudinary } = require("cloudinary");

// Ensure required env vars are present
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER,
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error(
    "Missing Cloudinary credentials. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in your environment (.env.local)."
  );
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const localDir = path.resolve(process.cwd(), "public/img/all");
const targetFolder = CLOUDINARY_FOLDER || "all"; // cloudinary folder path

const allowed = new RegExp(
  /\.(png|jpe?g|webp|gif|svg|mp4|mov|webm|m4v)$/i
);

async function main() {
  if (!fs.existsSync(localDir)) {
    console.error(`Directory not found: ${localDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(localDir)
    .filter((f) => allowed.test(f))
    .sort();

  if (files.length === 0) {
    console.log("No uploadable files found.");
    return;
  }

  console.log(
    `Uploading ${files.length} file(s) from ${localDir} to Cloudinary folder '${targetFolder}'...`
  );

  const results = [];
  for (const file of files) {
    const filePath = path.join(localDir, file);
    const publicId = path.basename(file, path.extname(file));
    try {
      const res = await cloudinary.uploader.upload(filePath, {
        folder: targetFolder,
        public_id: publicId,
        overwrite: true,
        resource_type: "auto",
      });
      results.push({ file, public_id: res.public_id, url: res.secure_url });
      console.log(`✔ Uploaded: ${file} → ${res.secure_url}`);
    } catch (err) {
      console.error(`✖ Failed: ${file}`, err?.message || err);
    }
  }

  const outPath = path.resolve(process.cwd(), "cloudinary-map.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nSaved mapping to ${outPath}`);

  const base = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${targetFolder}/`;
  console.log("\nSet NEXT_PUBLIC_CLOUDINARY_BASE to:");
  console.log(base);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


