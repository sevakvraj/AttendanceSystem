import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Supported image extensions (all common types)
const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif|svg|avif|heic|bmp)$/i;

// Determine sequence / ID order for photos
function getPhotoOrder(filename: string): number {
  // If filename starts with number (e.g. 1.jpg, 02.png)
  const prefixMatch = filename.match(/^(\d+)/);
  if (prefixMatch) return parseInt(prefixMatch[1], 10);

  // Exact sequence for batch Freshers memories:
  if (filename.includes("9.35.04")) return 1; // 1: Welcome Invitation Card
  if (filename.includes("IMG_0042")) return 2; // 2: Party Hall Arrival
  if (filename.includes("IMG_0045")) return 3; // 3: CRUD Fresher's '26 Stage
  if (filename.includes("IMG_0051")) return 4; // 4: Squad on Stage
  if (filename.includes("IMG_0053")) return 5; // 5: MCA Class of 26-27 Group
  if (filename.includes("9.41.29")) return 6; // 6: Chandelier Celebration Finale

  const anyNum = filename.match(/(\d+)/);
  if (anyNum) return 100 + parseInt(anyNum[1], 10);

  return 999;
}

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), "public", "images", "Feleshepic");

    if (!fs.existsSync(dirPath)) {
      return NextResponse.json({ photos: [] });
    }

    const files = await fs.promises.readdir(dirPath);
    const imageFiles = files.filter((f) => IMAGE_EXTENSIONS.test(f));

    // Sort strictly by ID sequence
    imageFiles.sort((a, b) => getPhotoOrder(a) - getPhotoOrder(b));

    const photos = imageFiles.map((filename) => {
      const order = getPhotoOrder(filename);
      let title = `Freshers Moment #${order}`;
      let caption = "MCA Class of 26-27 Freshers Celebration";

      if (filename.includes("9.35.04")) {
        title = 'console.write("welcome"); 🍫';
        caption = "Fresher's '26 welcome card with handmade floral bow & chocolate gift";
      } else if (filename.includes("IMG_0042")) {
        title = "Party Hall Squad 🌟";
        caption = "Dressed to impress for our grand Freshers celebration";
      } else if (filename.includes("IMG_0045")) {
        title = "CRUD Fresher's '26 ✨";
        caption = "Golden balloons, silver sparkles, and smiles on the main stage";
      } else if (filename.includes("IMG_0051")) {
        title = "Squad Goals on Stage 📸";
        caption = "MCA batch squad capturing unforgettable moments together";
      } else if (filename.includes("IMG_0053")) {
        title = "MCA Class of 26-27 ✨";
        caption = "The full crew celebrating the start of an amazing journey";
      } else if (filename.includes("9.41.29")) {
        title = "Hands in the Air! 🥳";
        caption = "The entire MCA batch celebrating under the chandelier with endless energy";
      }

      return {
        id: order,
        order,
        displayId: order < 10 ? `0${order}` : `${order}`,
        filename,
        title,
        tag: "FRESHERS '26",
        category: "freshers",
        image: `/images/Feleshepic/${encodeURIComponent(filename)}`,
        date: "September 2026",
        caption,
      };
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error reading Feleshepic directory:", error);
    return NextResponse.json({ photos: [] }, { status: 500 });
  }
}
