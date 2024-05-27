const path = require('path');

module.exports = {
    mode: 'production', // Optimize for production on cPanel
    entry: './src/index.js', // Your main entry point (already set in index.js)
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'), // Output directory
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Handle all JavaScript files
                exclude: /node_modules/, // Exclude node_modules
                use: 'babel-loader', // Use Babel for transpilation (if needed)
            },
        ],
    },
};
