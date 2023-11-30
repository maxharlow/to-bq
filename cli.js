import Process from 'process'
import Yargs from 'yargs'
import run from './to-bq.js'
import cliRenderer from './cli-renderer.js'

async function setup() {
    const instructions = Yargs(Process.argv.slice(2))
        .usage('Usage: to-bq <filename> <location>')
        .wrap(null)
        .option('k', { alias: 'keyfile', type: 'string', describe: 'Location of a Google Cloud credentials file' })
        .option('l', { alias: 'dataset-location', type: 'string', describe: 'The geographic location where the dataset should reside, see: https://cloud.google.com/bigquery/docs/locations' })
        .help('?').alias('?', 'help')
        .version().alias('v', 'version')
        .demandCommand(2, '')
    const { alert, finalise } = cliRenderer()
    try {
        const {
            _: [filename, location],
            keyfile,
            datasetLocation
        } = instructions.argv
        const [projectName, datasetName, tableName] = location.split('.')
        alert({
            message: 'Starting up...',
            importance: 'info'
        })
        const output = await run(filename, projectName, datasetName, datasetLocation, tableName, keyfile, alert)
        await finalise('complete')
    }
    catch (e) {
        alert({
            message: e.message,
            importance: 'error'
        })
        await finalise('error')
        Process.exit(1)
    }
}

setup()
