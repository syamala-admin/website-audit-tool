const express = require('express');
const taskController = require('../controllers/TaskController');

const router = express.Router();

router.post('/', (req, res) => taskController.createTask(req, res));

module.exports = router;
