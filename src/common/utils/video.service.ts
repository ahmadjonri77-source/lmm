import { Injectable } from '@nestjs/common';
import ffmpeg from 'fluent-ffmpeg';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, extname, basename } from 'path';

@Injectable()
export class VideoService {
 async convertToMp4(inputPath: string): Promise<string> {
  const outputDir = join(
    process.cwd(),
    'src/uploads/videos',
  );

  const filename = basename(
    inputPath,
    extname(inputPath),
  );

  const outputPath = join(
    outputDir,
    `${filename}.mp4`,
  );

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        '-preset fast',
        '-crf 23',
        '-movflags +faststart',
      ])
      .on('end', () => {
        if (existsSync(inputPath)) {
          unlinkSync(inputPath);
        }

        // MUHIM: faqat filename qaytaramiz
        resolve(`${filename}.mp4`);
      })
      .on('error', (error) => {
        reject(error);
      })
      .save(outputPath);
  });
}
}