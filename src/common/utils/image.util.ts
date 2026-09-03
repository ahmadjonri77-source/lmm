import convert from 'heic-convert';
import * as fs from 'fs';

export async function convertHeic(file: Express.Multer.File) {
  
  if (!file || !file.mimetype.includes('heic',)) return file.filename;
  const buffer = await convert({
    buffer: fs.readFileSync(file.path),
    format: 'JPEG',
    quality: 0.9,
  });

  const name = `${Date.now()}.jpg`;
  const path = file.path.replace(file.filename, name);

  fs.writeFileSync(path, buffer);
  fs.unlinkSync(file.path);

  return name;
}