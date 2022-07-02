import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";

import { name, description, version } from "../package.json";

import { list, get } from "./load";
import { saveGitignore } from "./store";
import type { GitHubApiTreesResponse, GitHubFileResponse, GitHubTreeFile } from "./types";

program.name(name).description(description).version(version);

program
  .arguments("[language]")
  .option("-o, --overwrite", "Overwrite existing .gitignore")
  .action(async (languageFromCli, options: { overwrite: boolean }) => {
    try {
      const gitignores = await list();

      const language = languageFromCli
        ? languageFromCli
        : (
            await inquirer.prompt({
              type: "list",
              name: "language",
              message: "Choose a .gitignore to download",
              choices: gitignores.map((gi) => gi.path.replace(".gitignore", "")),
              filter(val: string) {
                return val.toLowerCase();
              },
            })
          ).language;

      const gitignoreFile = gitignores.find(
        (gi) => gi.path.toLowerCase() === `${language.toLowerCase()}.gitignore`
      );

      if (!gitignoreFile) {
        const jsWarning = language.toLowerCase() === "javascript" ? ' - Did you mean "Node"?' : "";
        console.error(chalk.red(`No gitignore file found for "${language}"${jsWarning}`));
        process.exit(1);
      }

      const gitignore = await get(gitignoreFile);

      await saveGitignore(gitignore, gitignoreFile, gitignores, options.overwrite);
    } catch (e: any) {
      console.error(e.message);
      process.exit(1);
    }
  });

program.parse();

export { list, get };
export type { GitHubApiTreesResponse, GitHubTreeFile, GitHubFileResponse };
