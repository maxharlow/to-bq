import GoogleCloud from '@google-cloud/bigquery'

async function run(filename, projectName, datasetName, datasetLocation, tableName, keyfile, alert) {
    const client = new GoogleCloud.BigQuery({
        projectId: projectName,
        keyFilename: keyfile
    })
    const dataset = client.dataset(datasetName)
    const [datasetExists] = await dataset.exists()
    if (!datasetExists) {
        await client.createDataset(datasetName, {
            location: datasetLocation
        })
        alert({ message: 'Dataset created' })
    }
    else alert({ message: 'Dataset already exists' })
    const table = dataset.table('test_table')
    const [tableExists] = await table.exists()
    if (!tableExists) {
        await dataset.createTable(tableName, {})
        alert({ message: 'Table created' })
    }
    else alert({ message: 'Table already exists' })
    alert({ message: 'Data uploading...' })
    const format = filename.split('.').pop().toLowerCase()
    const formatType = format === 'ndjson' ? 'NEWLINE_DELIMITED_JSON'
        : format === 'jsonl' ? 'NEWLINE_DELIMITED_JSON'
        : format === 'parquet' ? 'PARQUET'
        : format === 'avro' ? 'AVRO'
        : format === 'orc' ? 'ORC'
        : 'CSV'
    await table.load(filename, {
        autodetect: true,
        schemaUpdateOptions: ['ALLOW_FIELD_ADDITION', 'ALLOW_FIELD_RELAXATION'],
        sourceFormat: formatType
    })
    alert({ message: 'Data uploaded' })
}

export default run
