'use strict'
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const port = 9527 // dev port

module.exports = {
    publicPath: './',
    outputDir: 'J07Web',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                // target: 'http://localhost:8082',
                target: 'http://localhost:9527',
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
        }
    },
    css: {
        loaderOptions: {
            sass: {
                data: `@import "@/styles/variables.scss";`
            }
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },
    chainWebpack(config) {
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        // set preserveWhitespace
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.preserveWhitespace = true
                return options
            })
            .end()

        config.when(process.env.NODE_ENV === 'development',
            config => config.devtool('cheap-source-map')
        )

        config.when(process.env.NODE_ENV !== 'development',
            config => {
                config.plugin('ScriptExtHtmlWebpackPlugin')
                    .after('html')
                    .use('script-ext-html-webpack-plugin', [{
                        inline: /runtime\..*\.js$/
                    }])
                    .end()
                config.optimization.splitChunks({
                    chunks: 'all',
                    cacheGroups: {
                        libs: {
                            name: 'chunk-libs',
                            test: /[\\/]node_modules[\\/]/,
                            priority: 10,
                            chunks: 'initial' // only package third parties that are initially dependent
                        },
                        elementUI: {
                            name: 'chunk-elementUI', // split elementUI into a single package
                            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                        },
                        commons: {
                            name: 'chunk-commons',
                            test: resolve('src/components'), // can customize your rules
                            minChunks: 2, //  minimum common number
                            priority: 5,
                            reuseExistingChunk: true
                        }
                    }
                })
                config.optimization.runtimeChunk('single')
            }
        )
    }
}
