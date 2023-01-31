module.exports = {
  stories: ["../stories/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  webpackFinal: (config) => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: config.module.rules.filter((r) => {
          if (r.loader && r.loader.includes("source-loader")) {
            return false;
          }
          return true;
        }),
      },
    };
  },
};
