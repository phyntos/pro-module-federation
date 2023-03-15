import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';

const config: webpack.Configuration = {
    target: 'web',
    entry: './src/pro-module-federation.ts',
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
        filename: 'pro-module-federation.js',
        library: {
            name: 'ReactModuleFederation',
            type: 'umd',
        },
        clean: true,
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
