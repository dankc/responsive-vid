#!/usr/bin/node
import fs from 'node:fs';
import path from 'node:path';

// Helper function to check if a path is a directory
const isDirectory = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats.isDirectory());
      }
    });
  });
};

const findDir = async (location, cb) => {
  try {
    const files = await fs.promises.readdir(location);
    for (const file of files) {
      const fullPath = path.join(location, file);
      const dir = await isDirectory(fullPath);

      if (dir) {
        await findDir(fullPath, cb);
      } else {
        await cb(file, location);
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }
};

const rename = async () => {
  const dist = './dist/';
  const cb = async (file, location) => {
    if (/\.d\.ts$/.test(file)) {
      const oldPath = path.join(location, file);
      const newPath = path.join(location, 'responsive-video.d.ts');
      try {
        await fs.promises.rename(oldPath, newPath);
        console.log('Rename complete!');
      } catch (err) {
        console.error('Rename failed:', err);
      }
    }
  };

  await findDir(dist, cb);
};

rename();