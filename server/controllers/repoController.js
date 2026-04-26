import simpleGit from "simple-git";
import path from "path";
import Repo from "../models/Repo.js";
import { getAllFiles, readFilesContent } from "../services/fileParser.js";
import { chunkCode } from "../services/chunker.js";
import { generateExplanation } from "../services/aiService.js";

import Chunk from "../models/Chunk.js";

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
        const repo = await Repo.create({
      user: req.user.id,
      repoUrl,
      name: repoName,
      localPath,
    });
    // let explanations = [];
    const sampleChunks = allChunks.slice(0, 5);

    for (let chunk of sampleChunks) {
      const explanation = await generateExplanation(chunk.content);

      await Chunk.create({
        repo: repo._id,
        file: chunk.file,
        content: chunk.content,
        explanation,
      });
    }

    console.log("Total files:", files.length);



    res.json({
      message: "Repo processed and explanations stored",
      totalFiles: files.length,
      totalChunks: allChunks.length,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};