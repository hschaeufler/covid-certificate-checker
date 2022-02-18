const path = require("path");
const glob = require("glob");

//see: https://jasmine.github.io/tutorials/react_with_browser
module.exports = {
    entry: glob.sync("spec/**/*spec.ts"),
    output: {
        filename: "test.js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [],
    resolve: {
        modules: [__dirname, "src", "node_modules"],
        extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
}