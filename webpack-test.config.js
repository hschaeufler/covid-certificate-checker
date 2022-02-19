const path = require("path");
const glob = require("glob");

//see: https://jasmine.github.io/tutorials/react_with_browser
module.exports = {
    entry: glob.sync("spec/**/*spec.ts"),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    output: {
        filename: "test.js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        modules: [__dirname, "src", "node_modules", "dist"],
        extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
    },
}