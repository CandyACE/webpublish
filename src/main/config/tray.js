export default [
    {
        label: '显示主界面',
        click: function () {
            mainWindow.show()
        }
    },
    {
        label: '退出',
        click: function () {
            app.quit()
            // app.quit() //因为程序设定关闭为最小化，所以调用两次关闭，防止最大化时一次不能关闭的情况
        }
    }
]