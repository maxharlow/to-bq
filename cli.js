import Process from 'process'
import FSExtra from 'fs-extra'
import Yargs from 'yargs'
import run from './to-bq.js'
import cliRenderer from './cli-renderer.js'

async function setup() {
    const instructions = Yargs(Process.argv.slice(2))
        .usage('Usage: to-bq <filename> <location>')
        .wrap(null)
        .option('k', { alias: 'keyfile', type: 'string', describe: 'Location of a Google Cloud credentials file' })
        .option('l', { alias: 'dataset-location', type: 'string', describe: 'The geographic location where the dataset should reside, see: https://cloud.google.com/bigquery/docs/locations' })
        .option('s', { alias: 'schema', type: 'string', describe: 'Location of a Json file specifying the schema, if the table does not already have one' })
        .help('?').alias('?', 'help')
        .version().alias('v', 'version')
        .demandCommand(2, '')
    const { alert, finalise } = cliRenderer()
    try {
        const {
            _: [filename, location],
            keyfile,
            datasetLocation,
            schema
        } = instructions.argv
        const [projectName, datasetName, tableName] = location.split('.')
        alert({
            message: 'Starting up...',
            importance: 'info'
        })
        const schemaData = schema ? await FSExtra.readJson(schema) : undefined
        const output = await run(filename, projectName, datasetName, datasetLocation, tableName, keyfile, schemaData, alert)
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
