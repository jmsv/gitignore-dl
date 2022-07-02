import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const name = require("./package.json").main.replace(/\.js$/, "");
const input = "src/index.ts";

export default [
  {
    input,
    plugins: [
      esbuild({ minify: Boolean(process.env.GITHUB_ACTIONS) }),
      json(),
      nodeResolve(),
      commonjs(),
    ],
    output: [
      {
        file: `${name}.js`,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: `${name}.mjs`,
        format: "es",
        sourcemap: true,
      },
    ],
  },
  {
    input,
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: "es",
    },
  },
];
