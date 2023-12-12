import Process from 'process'
import Events from 'events'
import * as Luxon from 'luxon'
import * as Chalk from 'chalk'

const events = new Events.EventEmitter()
const beginning = new Date()
let finalisation = null

function formatDuration(milliseconds, prefix = '', suffix = '') {
    const [days, hours, minutes, seconds] = Luxon.Duration.fromMillis(milliseconds).toFormat('d:h:m:s').split(':').map(Number)
    const units = [
        days > 0 && days < 100000 ? `${days}d` : '',
        hours > 0 && days < 100 ? `${hours}h` : '',
        minutes > 0 && days === 0 ? `${minutes}m` : '',
        seconds > 0 && hours === 0 && days === 0 ? `${seconds}s` : ''
    ].join('')
    if (!units) return ''
    return prefix + units + suffix
}

function formatFinalisation(mode) {
    if (mode === 'complete') return [formatDuration(new Date() - beginning, 'Completed in ', '!') || 'Completed!']
    else if (mode === 'interrupt') return ['Interrupted!']
    else if (mode === 'error') return ['Failed!']
    else return []
}

function setup() {
    const alert = details => {
        if (finalisation) return
        console.error(details.importance === 'error' ? Chalk.chalkStderr.red.bold(details.message) : details.message)
    }
    const finalise = mode => {
        if (!finalisation) formatFinalisation(mode).map(text => console.error(text))
        finalisation = mode
        if (doRedisplay) return new Promise(resolve => events.on('finished', resolve))
        else return Promise.resolve()
    }
    if (Process.stdin.isTTY) Process.stdin.setRawMode(true)
    Process.stdin.setEncoding('utf8')
    Process.stdin.on('data', async data => {
        if (data === '\u0003') {
            console.error(Chalk.chalkStderr.bgRedBright.white('Stopping...'))
            await finalise('interrupt')
            Process.exit(0)
        }
    })
    Process.stdin.unref()
    return { alert, finalise }
}

export default setup
