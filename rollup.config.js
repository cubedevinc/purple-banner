import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import styles from "rollup-plugin-styles";
import dotenv from "rollup-plugin-dotenv";

import packageJson from "./package.json";

export default {
  input: "src/index.js",
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
    babel({
      presets: ["@babel/preset-react"],
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    styles(),
    terser(),
  ],
  external: ["react", "react-dom"],
};
