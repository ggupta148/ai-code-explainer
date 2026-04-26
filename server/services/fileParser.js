import fs from "fs";
import path from "path";

const allowedExtensions = [".js", ".ts", ".jsx", ".tsx", ".json"];

export const getAllFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (allowedExtensions.includes(path.extname(file))) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
};

export const readFilesContent = (files) => {
  return files.map((file) => ({
    file,
    content: fs.readFileSync(file, "utf-8"),
  }));
};