import simpleGit from "simple-git";
import path from "path";
import Repo from "../models/Repo.js";
import { getAllFiles, readFilesContent } from "../services/fileParser.js";
import { chunkCode } from "../services/chunker.js";

const git = simpleGit();

export const addRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body;

    const repoName = repoUrl.split("/").pop().replace(".git", "");
    const localPath = path.join("repos", repoName);

    // Clone repo
    await git.clone(repoUrl, localPath);

    // ✅ ADD THIS PART HERE
    const files = getAllFiles(localPath);
    const fileContents = readFilesContent(files);

    let allChunks = [];

    fileContents.forEach((file) => {
    const chunks = chunkCode(file.content);

    const formattedChunks = chunks.map((chunk) => ({
        file: file.file,
        content: chunk,
    }));

    allChunks.push(...formattedChunks);
    });

    console.log("Total chunks:", allChunks.length);

    console.log("Total files:", files.length);

    const repo = await Repo.create({
      user: req.user.id,
      repoUrl,
      name: repoName,
      localPath,
    });

    res.json({
        message: "Repo processed",
        totalFiles: files.length,
        totalChunks: allChunks.length,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};