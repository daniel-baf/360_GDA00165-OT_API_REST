module.exports = {
  parser: "babel-eslint", // or "@typescript-eslint/parser" if using TypeScript
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  settings: {
    "import/resolver": {
      alias: {
        map: [
          ["@services", "./src/services"],
          ["@models", "./src/model"],
          ["@ORM", "./src/model/database"],
          ["@helpers", "./src/helpers"],
          ["@middlewares", "./src/middlewares"],
          ["@controllers", "./src/controllers"],
        ],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    // Add custom rules here
    "import/no-unresolved": "error", // This ensures that unresolved imports are caught
  },
};
