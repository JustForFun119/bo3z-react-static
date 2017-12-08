var path = require('path');
var ContextReplacementPlugin = require('webpack').ContextReplacementPlugin;

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        historyApiFallback: true
    },
    devtool: 'source-map'
};