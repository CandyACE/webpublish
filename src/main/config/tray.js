export default [
    {
        id: 'app.show',
        command: function () {
            application.show()
        }
    },
    {
        id: 'app.check-for-updates',
        command: function () {
            application.updateManager.checkForUpdates(true)
        }
    },
    { type: "separator" },
    {
        id: 'app.quit',
        command: function () {
            application.quit()
        }
    }
]