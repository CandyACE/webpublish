import { access, constants } from 'fs'
import { Message } from 'element-ui'
const remote = require('@electron/remote')

export function showItemInFolder(fullPath, { errorMsg, errorFun }) {
    if (!fullPath) {
        return
    }

    console.log('before access')
    access(fullPath, constants.F_OK, (err) => {
        console.log(`${fullPath} ${err ? 'does not exist' : 'exists'}`)
        if (err) {
            Message.error(errorMsg)
            errorFun && errorFun()
            return
        }

        remote.shell.showItemInFolder(fullPath)
    })
}

export function openItem(fullPath, { errorMsg }) {
    if (!fullPath) {
        return
    }
    const result = remote.shell.openItem(fullPath)
    if (!result && errorMsg) {
        Message.error(errorMsg)
    }
    return result
}