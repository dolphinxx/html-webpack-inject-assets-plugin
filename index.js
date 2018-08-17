const DEFAULT_OPTIONS = {
    jsPlaceholder: '!%js slot%!',
    cssPlaceholder: '!%css slot%!'
};
function HtmlWebpackInjectAssetsPlugin(options = {}) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
}

HtmlWebpackInjectAssetsPlugin.prototype.apply = function(compiler) {
    compiler.hooks.compilation.tap('HtmlWebpackInjectAssetsPlugin', compilation => {
        compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync('HtmlWebpackInjectAssetsPlugin', (data, cb) => {
            if(data.html) {
                const jsSlot = data.html.indexOf(this.options.jsPlaceholder);
                if(jsSlot !== -1 && data.assets.js.length > 0) {
                    let jsAssets = '';
                    for(let asset of data.assets.js) {
                        jsAssets += `<script src="${asset.path}" type="application/javascript"></script>`;
                    }
                    data.html = data.html.substring(0, jsSlot) + jsAssets + data.html.substring(jsSlot + this.options.jsPlaceholder.length);
                }
                const cssSlot = data.html.indexOf(this.options.cssPlaceholder);
                if(cssSlot !== -1 && data.assets.css.length > 0) {
                    let cssAssets = '';
                    for(let asset of data.assets.css) {
                        cssAssets += `<link href="${asset.path}" type="text/css" rel="stylesheet">`;
                    }
                    data.html = data.html.substring(0, cssSlot) + cssAssets + data.html.substring(cssSlot + this.options.cssPlaceholder.length);
                }
            }
            cb(null, data);
        })
    });
};
module.exports = HtmlWebpackInjectAssetsPlugin;