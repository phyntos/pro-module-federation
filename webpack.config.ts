import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';

const config: webpack.Configuration = {
    target: 'web',
    entry: { index: './src/pro-module-federation.ts', plugin: './src/plugin/index.ts' },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [/node_modules/, path.resolve(__dirname, './src/dev/')],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: (pathData) => {
            if (pathData.chunk?.name === 'index') return 'pro-module-federation.js';
            if (pathData.chunk?.name === 'plugin') return 'plugin/index.js';
            return '[name].js';
        },
        library: {
            name: 'ProMF',
            type: 'umd',
        },
        clean: true,
        globalObject: 'this',
        umdNamedDefine: true,
    },
    externals: {
        react: 'react',
        'react-dom': 'react-dom',
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
};

export default config;
