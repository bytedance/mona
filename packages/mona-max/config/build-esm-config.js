const path = require("path");

module.exports = {
  entry: {
    index: path.resolve(process.cwd(), "./src/index")
  },
  output: {
    filename: "[name].esm.js",
    library: {
      type: "module",
    },
    environment: {
      module: true,
    },
  },
  experiments: {
    outputModule: true,
  },
  externalsType: "module",
  externals: {
    react: "react",
    "react-dom": "react-dom"
  }
};
