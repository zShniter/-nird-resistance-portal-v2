const express = require('express');
const router = express.Router();
const {
  getWarriors,
  getWarrior,
  createWarrior,
  updateWarrior,
  deleteWarrior,
  addAchievement,
  searchWarriors
} = require('../controllers/warriorController');

router.route('/')
  .get(getWarriors)
  .post(createWarrior);

router.route('/:id')
  .get(getWarrior)
  .put(updateWarrior)
  .delete(deleteWarrior);

router.route('/:id/achievements')
  .post(addAchievement);

router.route('/search/:query')
  .get(searchWarriors);

module.exports = router;