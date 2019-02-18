const mongo = require('mongodb');

const connectionString = 'mongodb://localhost:27017/sites';
const databaseName = 'sites';
const collectionName = 'scrapes';

const _addSite = async url => new Promise(async (resolve) => {
    try {
        mongo.MongoClient.connect(connectionString, {
            sslValidate: false,
            useNewUrlParser: true,
        }, (err, db) => {
            if (err) {
                console.log(`mongo connect ERROR: ${err}`);
                resolve(false);
                return;
            }

            const database = db.db(databaseName);

            database.collection(collectionName).insertOne({
                status: 'pending',
                url,
            }, (error, result) => {
                if (error) {
                    console.log(`mongo insert ERROR: ${error}`);
                    resolve(false);
                    return;
                }

                resolve(result.insertedId.toString());
            });
        });
    } catch (e) {
        console.log(`ERROR: ${e}`);
        resolve(false);
    }
});

const _get = async id => new Promise(async (resolve) => {
    try {
        mongo.MongoClient.connect(connectionString, {
            sslValidate: false,
            useNewUrlParser: true,
        }, (err, db) => {
            if (err) {
                console.log(`mongo connect ERROR: ${err}`);
                resolve(false);
                return;
            }

            const database = db.db(databaseName);

            database.collection(collectionName).findOne({
                _id: new mongo.ObjectID(id),
            }, (error, result) => {
                if (error) {
                    console.log(`mongo get ERROR: ${error}`);
                    resolve(false);
                    return;
                }

                resolve(result);
            });
        });
    } catch (e) {
        console.log(`ERROR: ${e}`);
        resolve(false);
    }
});

const _getPending = async () => new Promise(async (resolve) => {
    try {
        mongo.MongoClient.connect(connectionString, {
            sslValidate: false,
            useNewUrlParser: true,
        }, (err, db) => {
            if (err) {
                console.log(`mongo connect ERROR: ${err}`);
                resolve(false);
                return;
            }

            const database = db.db(databaseName);

            database.collection(collectionName).find({
                status: 'pending',
            }).toArray((error, result) => {
                if (error) {
                    console.log(`mongo get ERROR: ${error}`);
                    resolve(false);
                    return;
                }

                resolve(result);
            });
        });
    } catch (e) {
        console.log(`ERROR: ${e}`);
        resolve(false);
    }
});

const _setFailed = async id => new Promise(async (resolve) => {
    try {
        mongo.MongoClient.connect(connectionString, {
            sslValidate: false,
            useNewUrlParser: true,
        }, (err, db) => {
            if (err) {
                console.log(`mongo connect ERROR: ${err}`);
                resolve(false);
                return;
            }

            const database = db.db(databaseName);

            database.collection(collectionName).updateOne({
                _id: id,
            },
            {
                $set: {
                    status: 'failed',
                },
            }, (error) => {
                if (error) {
                    console.log(`mongo insert ERROR: ${error}`);
                    resolve(false);
                    return;
                }

                resolve(true);
            });
        });
    } catch (e) {
        console.log(`ERROR: ${e}`);
        resolve(false);
    }
});

const _setSuccess = async (id, html) => new Promise(async (resolve) => {
    try {
        mongo.MongoClient.connect(connectionString, {
            sslValidate: false,
            useNewUrlParser: true,
        }, (err, db) => {
            if (err) {
                console.log(`mongo connect ERROR: ${err}`);
                resolve(false);
                return;
            }

            const database = db.db(databaseName);

            database.collection(collectionName).updateOne({
                _id: id,
            },
            {
                $set: {
                    status: 'success',
                    html,
                },
            }, (error) => {
                if (error) {
                    console.log(`mongo insert ERROR: ${error}`);
                    resolve(false);
                    return;
                }

                resolve(true);
            });
        });
    } catch (e) {
        console.log(`ERROR: ${e}`);
        resolve(false);
    }
});


const service = {
    addOne: async url => _addSite(url),
    get: async id => _get(id),
    getPending: async () => _getPending(),
    setFailed: async id => _setFailed(id),
    setSuccess: async (id, html) => _setSuccess(id, html),
};

module.exports = service;
