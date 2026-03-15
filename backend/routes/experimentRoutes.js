// backend/routes/experimentRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// @desc   Get all experiments for a specific semester
router.get('/semester/:semId', async (req, res) => {
  try {
    const { semId } = req.params;
    
    const sql = `
      SELECT 
        id, 
        semester, 
        title, 
        description, 
        duration, 
        team_size AS "teamSize", 
        difficulty, 
        summary
      FROM experiments 
      WHERE semester = $1 
      ORDER BY title ASC
    `;
    
    const { rows } = await db.query(sql, [semId]);
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc   Get a single experiment by its ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
      const sql = `
      SELECT 
        id,
        semester,
        title,
        description,
        duration,
        team_size AS "teamSize",
        difficulty,
        summary,
        learning_objectives AS "learningObjectives",
        safety_precautions AS "safetyPrecautions",
        procedure_steps AS "procedure",
        observation_columns AS "observationColumns",
        required_materials AS "requiredMaterials",
        simulator_url AS "simulatorUrl",
        image_url AS "imageUrl"
      FROM experiments 
      WHERE id = $1
    `;

    const { rows } = await db.query(sql, [id]);

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Experiment not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;