# `@cube-dev/purple-banner`

The Purple Banner is a React-component for showing Cube Dev, Inc. events on our websites.

## Developing

Run Storybook for easy developing by `npm run storybook`.

## Local testing

1. Build the package by command  `npm run build`.

2. Run `npm link` to place the package in local registry.

  > **Note:** in some cases there are mistakes with React hooks because of few versions of React. In this case run `npm link __path-to-website-directory__/node_modules/react` in package directory.

3. Go to webapp directory and run `npm link @cube-dev/purple-banner`. Now you can use `@cube-dev/purple-banner` inside your webapp.

  ```jsx
  import PurpleBanner from "@cube-dev/purple-banner";
  ```

4. When you'll finish just unlink package by command `npm unlink @cube-dev/purple-banner`.
