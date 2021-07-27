import { existsSync, lstatSync } from 'fs'
import is from 'electron-is'

export function splitArgv(argv) {
    const args = []
    const extra = {}
    for (const arg of argv) {
        if (arg.startsWith('--')) {
            const kv = arg.split('=')
            const key = kv[0]
            const value = kv[1] || '1'
            extra[key] = value
            continue
        }
        args.push(arg)
    }
    return { args, extra }
}

export function isDirectory(path) {
    return existsSync(path) && lstatSync(path).isDirectory()
}

export function parseArgvAsFile(argv) {
    let arg = argv[1]
    if (!arg || isDirectory(arg)) {
        return
    }

    if (is.linux()) {
        arg = arg.replace('file://', '')
    }
    return arg
}