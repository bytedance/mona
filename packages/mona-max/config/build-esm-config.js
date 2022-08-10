module.exports = {
  output: {
    filename: "[name].esm.js",
    library: {
      type: "module",
    },
    // environment: {
    //   module: true,
    // },
  },
  experiments: {
    outputModule: true,
  },
  externalsType: "window",
  externals: {
    react: "react",
    "react-dom": "react-dom"
  }
};
