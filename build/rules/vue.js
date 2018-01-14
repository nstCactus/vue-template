const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (config) => {
    const vueConfig = {
        test:    /\.vue$/,
        loader:  'vue-loader',
        options: {
            loaders: {},
            postcss: [
                require('autoprefixer')({
                    browsers: [ 'chrome >= 49', 'last 2 versions' ],
                }),
            ],
        },
    };


    // Build : Sortir les styles dans des fichiers
    if (config.env == 'build') {
        vueConfig.options.loaders = {
            css: ExtractTextPlugin.extract({
                use:        'css-loader',
                // Override general publicPath configuration
                // Must be relative to assets folder
                publicPath: '',
                fallback:   'vue-style-loader',
            }),

            sass: ExtractTextPlugin.extract({
                use:        [
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
                // Override general publicPath configuration
                // Must be relative to assets folder
                publicPath: '',
                fallback:   'vue-style-loader',
            }),
        };
    }

    // Dev
    else {
        vueConfig.options.loaders = {
            css:  'vue-style-loader!css-loader',
            less: 'vue-style-loader!css-loader!less-loader',
        };
    }

    return vueConfig;
};
