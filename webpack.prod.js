const { merge } = require("webpack-merge");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const common = require("./webpack.common.js");

module.exports = (env) => {
  return merge(common, {
    mode: "production",
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin(),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              "default",
              {
                calc: true,
                convertValues: true,
                discardComments: {
                  removeAll: true,
                },
                discardDuplicates: true,
                discardEmpty: true,
                mergeRules: true,
                normalizeCharset: true,
                reduceInitial: true,
                svgo: true,
              },
            ],
          },
        }),
      ],
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
    performance: {
      hints: "warning",
      maxAssetSize: 1048576,
      maxEntrypointSize: 1048576,
    },
  });
};
