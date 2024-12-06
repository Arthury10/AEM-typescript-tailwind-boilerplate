const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = (env) => {
  const writeToDisk = env && Boolean(env.writeToDisk);

  return merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    performance: {
      hints: "warning",
      maxAssetSize: 1048576,
      maxEntrypointSize: 1048576,
    },
    devServer: {
      proxy: [
        {
          context: ["/"],
          target: "http://localhost:4502",
          secure: false,
        },
      ],
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      static: {
        directory: path.join(
          __dirname,
          "../apps/src/main/content/jcr_root/apps/INIT/components/custom"
        ),
        watch: true,
      },
      watchFiles: [path.join(__dirname, "src/main/webpack/**/*")],
      devMiddleware: {
        writeToDisk: writeToDisk,
      },
      hot: true, // Enabled Hot Module Replacement
      open: false,
      liveReload: false, // Disabled liveReload in favor of HMR
    },
  });
};
