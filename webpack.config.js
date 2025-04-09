const defaultConfig = require('@wordpress/scripts/config/webpack.config')

defaultConfig.module.rules.push({
    test: /\.dscss$/,
    use: ['raw-loader', 'sass-loader']
})

module.exports = defaultConfig;
