import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  repo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Repo",
  },
  file: String,
  content: String,
  explanation: String,
}, { timestamps: true });

export default mongoose.model("Chunk", chunkSchema);