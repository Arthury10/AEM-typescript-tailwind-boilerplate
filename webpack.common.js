"use strict";

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TSConfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const { readdirSync } = require("fs");

const resolve = {
  extensions: [".js", ".ts"],
  plugins: [
    new TSConfigPathsPlugin({
      configFile: "./tsconfig.json",
    }),
  ],
};

const SOURCE_ROOT = path.resolve(__dirname, "src/main/webpack");
const COMPONENT_ROOT = SOURCE_ROOT + "/components";
const CLIENTLIBS_ROOT = SOURCE_ROOT + "/clientlibs";

function generateEntries() {
  const entries = {};

  const componentNames = readdirSync(COMPONENT_ROOT, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  componentNames.forEach((componentName) => {
    const componentPath = path.resolve(
      COMPONENT_ROOT,
      componentName,
      "index.ts"
    );
    entries[componentName] = componentPath;
  });

  return entries;
}

function generateClientLibEntries() {
  const entries = {};

  const clientLibDirs = readdirSync(CLIENTLIBS_ROOT, { withFileTypes: true })
    .filter(
      (dirent) => dirent.isDirectory() && dirent.name.startsWith("clientlib-")
    )
    .map((dirent) => dirent.name);

  clientLibDirs.forEach((dir) => {
    const entryPath = path.resolve(CLIENTLIBS_ROOT, dir, "index.ts");
    entries[dir] = entryPath;
  });

  return entries;
}

const entries = generateEntries();
const clientLibsEntries = generateClientLibEntries();

module.exports = {
  resolve: resolve,
  entry: {
    ...clientLibsEntries,
    ...entries,
  },
  output: {
    filename: (pathData) => {
      const name = pathData.chunk.name;
      if (name?.startsWith("clientlib-")) {
        return `clientlibs/custom/${name}/js/${name}.js`;
      } else {
        return `components/custom/${name}/clientlibs/js/${name}.js`;
      }
    },
    path: path.resolve(
      __dirname,
      "../apps/src/main/content/jcr_root/apps/INIT"
    ),
    libraryTarget: "window",
    clean: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              onlyCompileBundledFiles: true,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: false,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: false,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  require("tailwindcss")("./tailwind.config.js"),
                  require("autoprefixer"),
                ],
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintPlugin({
      extensions: ["js", "ts", "tsx"],
    }),
    new MiniCssExtractPlugin({
      filename: (pathData) => {
        const name = pathData.chunk.name;
        if (name.startsWith("clientlib-")) {
          return `clientlibs/custom/${name}/css/${name}.css`;
        } else {
          return `components/custom/${name}/clientlibs/css/${name}.css`;
        }
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/main/webpack/components"),
          to: path.resolve(
            __dirname,
            "../apps/src/main/content/jcr_root/apps/INIT/components/custom"
          ),
          noErrorOnMissing: true,
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ["**/*.ts", "**/*.scss"],
          },
        },
        {
          from: path.resolve(__dirname, "src/main/webpack/clientlibs"),
          to: path.resolve(
            __dirname,
            "../apps/src/main/content/jcr_root/apps/INIT/clientlibs/custom"
          ),
          noErrorOnMissing: true,
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ["**/*.ts", "**/*.scss"],
          },
        },
      ],
    }),
  ],
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        default: false,
      },
    },
  },
  devtool: false,
};
