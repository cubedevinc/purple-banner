import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import styles from "rollup-plugin-styles";
import dotenv from "rollup-plugin-dotenv";
import typescript from "@rollup/plugin-typescript";

import packageJson from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      exports: "default",
    },
  ],
  plugins: [
    dotenv({ preventAssignment: true }),
    resolve(),
    commonjs({
      include: "node_modules/**",
    }),
    typescript(),
    styles(),
    terser(),
  ],
  external: ["react", "react-dom"],
};
