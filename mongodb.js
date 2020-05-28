// mongod initiliaze driver for mongodb and open the connection with mongodb server
//mongo opens mongo shell where we can work with db using shell command
// shell commands
// show dbs -- list all available database
// use <db_name> if(db exist select existing database  )else create new and select database

//db    show selected database

// show collections list all the available collections of selected database

// insert
// db.<col_name>.insert({object that scales});
// a new filed _id is created for every document which holds the cureent time stamps value and is unique to every documents

// fetch
// db.<col_name>.find({});
// db.<col_name>.find({}).pretty()// and query can build inside object
// db.<col_name>.find({ property: 'value' });

// update
// db.<col_name>.update({name:'ram'},{$set:{new_data_to_be_updated, name:'ramesh'}})
// multiple update
// db.<col_name>.update({}, { $set: { new_data_to_be_updated, name: 'ramesh' } }, { multi: true })
// upsert
// db.<col_name>.update({ name: 'ram' }, { $set: { new_data_to_be_updated, name: 'ramesh' } }, { upsert: true })

// remove
// db.<col_name>.remove({key:value});

// drop collections
// db.<col_name>.drop()
// drop whole database
// db.dropDatabase()

////////////////////////BACKUP and RESTORE//////////////////
// bson 
// backup
// mongodump this command bakcup all the data base of system into default dump folder
// mongodump --db <db_name> // backup selected database on default dump folder
// mongodump --db <db_name>  --out <_output_destination_folder>

// restore
// mongorestore // restore all the database from default dump folder
// mongorestore <path_to_backup_folder>

// mongodump and mongorestore always came in pair

// json || csv
// backup
// mongoexport
// mongoexport --db <db_name> --collection <collection_name> --out <path to store json file with .json extention>
// mongoexport -d <db_name> -c <collection_name> -o <path to store json file with .json extention>

// restore
// mongoimport 
// monogimport --db <db_name> --collection<collection_name> <path_to_json_file>

// mongoimport and mongoexport always came in pair

// csv
// backup
// mongoexport --db <db_name> --collection <col_name> --type=csv --fields 'coma_separated_dbValue as csv header' --out <path_to_export_dir_with_.csv_extension>

// import
// mongoimport --db< db-name> --collection<col_name> --type=csv --out <path to directory with csv file > --headerline
