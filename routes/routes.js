const express = require('express');

const router = express.Router();

const app = require('../app/app');

router.get('/', async (req, res) => {
    res.status(404).send();
});

// allow user to retrieve the status and html by the id supplied to them
router.get('/:id', async (req, res) => {
    try {
        const response = await app.get(req.params);
        res.status(response.status).send(response.message);
    } catch (e) {
        console.log(e.message);
        res.status(500).send();
    }
});

// need a route that allows user to post a url to retrieve
router.post('/', async (req, res) => {
    try {
        const response = await app.insert(req.body);
        res.status(response.status).send(response.message);
    } catch (e) {
        console.log(e.message);
        res.status(500).send();
    }
});

module.exports = router;
