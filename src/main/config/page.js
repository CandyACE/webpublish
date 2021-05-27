import is from 'electron-is'

export default {
    index: {
        attrs: {
            title: '快速发布工具',
            width: 1024,
            height: 768,
            minWidth: 800,
            minHeight: 420,
            transparent: !is.windows()
        },
        bindCloseToHide: true,
        url: is.dev() ? 'http://localhost:9080' : `file://${__dirname}/index.html`
    }
}