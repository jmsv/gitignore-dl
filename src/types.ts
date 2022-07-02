export interface GitHubApiTreesResponse {
  sha: string;
  url: string;
  tree: GitHubTreeFile[];
}

export interface GitHubTreeFile {
  path: string;
  mode: string;
  type: "tree" | "blob";
  sha: string;
  url: string;
}

export interface GitHubFileResponse {
  sha: string;
  node_id: string;
  size: number;
  url: string;
  content: string;
  encoding: string;
}

export enum GitHubFileMode {
  LINK = "120000",
  TREE = "040000",
  BLOB = "100644",
}
