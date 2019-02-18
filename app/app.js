const request = require('request');
const mongoService = require('./mongo/service');

// inserts a new item into the datastore
const _insert = async (requestBody) => {
    try {
        if (requestBody && requestBody.url && requestBody.url !== '') {
            // insert the document into
            const id = await mongoService.addOne(requestBody.url);
            return { status: 200, message: id };
        }
        return { status: 500, message: 'missing url' };
    } catch (e) {
        console.log(e.message);
        return { status: 500, message: 'error' };
    }
};

// get the item of the id that is passed int
const _get = async (params) => {
    try {
        if (params && params.id) {
            const mongoObj = await mongoService.get(params.id);
            return { status: 200, message: mongoObj };
        }
        return { status: 500, message: 'missing id' };
    } catch (e) {
        console.log(e.message);
        return { status: 500, message: 'error' };
    }
};

// process the individual item in the queue
const _processQueueItem = async item => new Promise(async (resolve) => {
    try {
        // make a request to the item url
        request({
            uri: item.url,
        }, async (error, response, body) => {
            if (error) {
                // failed getting the url, set the item as failed
                await mongoService.setFailed(item._id);
                resolve(false);
            } else {
                // got the url, log success and the html returned
                await mongoService.setSuccess(item._id, body);
                // console.log(body);
                resolve(true);
            }
        });
    } catch (e) {
        console.log(e.message);
        resolve(false);
    }
});

// processes the pending items in the database
const _processQueue = async () => {
    try {
        // get pending objects from database
        const items = await mongoService.getPending();
        // process pending objects
        await Promise.all(items.map(async (item) => {
            try {
                await _processQueueItem(item);
                return true;
            } catch (e1) {
                return false;
            }
        }));
        return true;
    } catch (e) {
        console.log(e.message);
        return false;
    }
};

const app = {
    insert: async requestBody => _insert(requestBody),
    get: async params => _get(params),
    processQueue: async () => _processQueue(),
};

module.exports = app;
