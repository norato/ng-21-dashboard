import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding"
  ],
  "framework": "@storybook/angular",
  "webpackFinal": async (config) => {
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // Add CSS loader for .storybook CSS files
    config.module.rules.push({
      test: /\.css$/,
      include: /\.storybook/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
      ],
    });

    return config;
  }
};
export default config;