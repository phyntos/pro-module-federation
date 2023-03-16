import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration as WebpackConfiguration, container, EnvironmentPlugin } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import packageJson from './package.json';
const { devDependencies } = packageJson;
import { ProMFPlugin } from './src/plugin';

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}

const config: Configuration = {
    target: 'web',
    entry: './src/dev/index.tsx',
    devtool: 'inline-source-map',
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        ProMFPlugin({
            filename: 'devTest.js',
            name: 'DevTest',
            dependencies: devDependencies,
            shared: ['react', 'react-dom'],
            remotes: [
                {
                    name: 'TestApp',
                    urls: {
                        LOCAL: 'http://localhost:3000/',
                    },
                    entry: 'testApp.js',
                },
            ],
            remoteConfigs: {
                TestApp: 'LOCAL',
            },
            plugins: {
                EnvironmentPlugin,
                ModuleFederationPlugin: container.ModuleFederationPlugin,
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            process: false,
        },
        // fallback: {
        //     util: false,
        //     url: false,
        //     path: false,
        //     stream: false,
        //     process: false,
        //     crypto: false,
        //     zlib: false,
        //     buffer: false,
        //     https: false,
        //     http: false,
        //     vm: false,
        //     fs: false,
        //     os: false,
        //     querystring: false,
        //     module: false,
        //     esbuild: false,
        //     'uglify-js': false,
        //     '@swc/core': false,
        //     worker_threads: false,
        //     constants: false,
        //     assert: false,
        //     child_process: false,
        // },
    },
    output: {
        filename: '[name].js',
        publicPath: '/',
    },
    devServer: {
        historyApiFallback: true,
        port: 4002,
        hot: true,
        open: true,
    },
};

export default config;
