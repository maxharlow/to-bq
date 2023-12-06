To BQ
=====

Uploads a data file to Google Cloud Bigquery.


Installing
----------

    $ npm install -g to-bq

Alternatively, don't install it and just prepend the command with `npx`.


Usage
-----

    $ to-bq data.csv my-google-cloud-project.my-dataset.my-table

Where `data.csv` is the source data to be uploaded and `my-google-cloud-project.my-dataset.my-table` is the destination inside Bigquery -- given as `<PROJECT NAME>.<DATASET NAME>.<TABLE NAME>`.

The data file can be in the following formats: CSV, NDJson (aka. JsonL), Parquet, Avro, or ORC. The format is guessed based on the file extension.

The dataset and project will be created if they do not already exist. Subsequent runs will append the data to the table.

A Google Cloud credentials keyfile needs to be specified with `-k` unless Google Cloud's [Application Default Credentials](https://cloud.google.com/docs/authentication/provide-credentials-adc) exist.

By default the schema for the table will be autodetected from the data being uploaded. Alternatively you can specify the location of a Json schema file with `-s`.

When a new dataset will be created you can specify the [location in Google Cloud](https://cloud.google.com/bigquery/docs/locations) where the data will reside using `-l`. If the dataset already exists this will have no effect.
