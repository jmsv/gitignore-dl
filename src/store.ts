import fs from "fs";
import path from "path";

import inquirer from "inquirer";
import chalk from "chalk";

import { get } from "./load";
import { GitHubFileMode, GitHubFileResponse, GitHubTreeFile } from "./types";

const gitignorePath = path.join(process.cwd(), ".gitignore");

export const checkGitignoreExists = () => {
  return fs.existsSync(gitignorePath);
};

export const saveGitignore = async (
  gitignore: GitHubFileResponse,
  gitignoreFile: GitHubTreeFile,
  gitignores: GitHubTreeFile[],
  overwriteIsOk: boolean
): Promise<void> => {
  if (!overwriteIsOk && checkGitignoreExists()) {
    console.error(chalk.red(".gitignore already exists in current directory"));

    const { overwrite } = await inquirer.prompt({
      type: "confirm",
      message: "Would you like to overwrite the existing .gitignore?",
      name: "overwrite",
      default: false,
    });

    if (!overwrite) {
      console.log(chalk.red("Exiting..."));
      process.exit(1);
    }
  }

  const content = Buffer.from(gitignore.content, "base64").toString("utf8");

  if (gitignoreFile.mode === GitHubFileMode.LINK) {
    const linkedTreeFile = gitignores.find((gi) => gi.path === content.trim());

    if (linkedTreeFile) {
      const linkedFileResponse = await get(linkedTreeFile);
      return saveGitignore(linkedFileResponse, linkedTreeFile, gitignores, true);
    }
  }

  fs.writeFileSync(gitignorePath, content);
  console.log(chalk.green(".gitignore saved! ✨"));
};
