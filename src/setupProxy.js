const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(
        '/durl',
        createProxyMiddleware({
            target: 'https://k8bouvq4zeo2.guyubao.com',
            changeOrigin: true
        })
    )
}
