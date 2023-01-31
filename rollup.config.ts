import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import dotenv from "rollup-plugin-dotenv";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/cjs/index.js",
      format: "cjs",
      exports: "default",
      sourcemap: true,
    },
  ],
  plugins: [
    // @ts-ignore
    dotenv.default(),
    resolve(),
    commonjs({
      include: "node_modules/**",
    }),
    typescript(),
    postcss(),
    terser(),
  ],
  external: ["react", "react-dom"],
};
