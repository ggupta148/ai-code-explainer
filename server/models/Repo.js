import mongoose from "mongoose";

const repoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  repoUrl: {
    type: String,
    required: true,
  },
  name: String,
  localPath: String,
}, { timestamps: true });

export default mongoose.model("Repo", repoSchema);