const express = require('express');
const router = express.Router();
const hallController = require('../controllers/halls');

router.get('/', hallController.getAllHalls);
router.get('/:id', hallController.getHallById);
router.post('/', hallController.createHall);
router.put('/:id', hallController.updateHall);
router.delete('/:id', hallController.deleteHall);
router.get('/select/cinemas', hallController.getCinemasForSelect);
router.get('/select/types', hallController.getHallTypesForSelect);

module.exports = router;