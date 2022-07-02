import axios from "axios";

import type {
  GitHubApiTreesResponse,
  GitHubFileResponse,
  GitHubTreeFile as GitHubTreeListFile,
} from "./types";

export const list = async (): Promise<GitHubTreeListFile[]> => {
  const filesResponse = await axios.get<GitHubApiTreesResponse>(
    "https://api.github.com/repos/github/gitignore/git/trees/main"
  );

  return filesResponse.data.tree.filter(
    (file) => file.type === "blob" && file.path.endsWith(".gitignore")
  );
};

export const get = async (file: GitHubTreeListFile): Promise<GitHubFileResponse> => {
  const response = await axios.get<GitHubFileResponse>(file.url);
  return response.data;
};
