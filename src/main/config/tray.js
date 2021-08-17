export default [
    {
        label: '显示 WebPublish',
        click: function () {
            application.show()
        }
    },
    {
        label: '检查更新...',
        click: function () {
            application.updateManager.checkForUpdates(true)
        }
    },
    { type: "separator" },
    {
        label: '退出 WebPublish',
        click: function () {
            application.quit()
        }
    }
]