// backend/seeder.js
const { Pool } = require('pg');
require('dotenv').config();

// Import data files
const { semester2Experiments } = require('../frontend/src/data/semester2');
const { semester3Experiments } = require('../frontend/src/data/semester3');
const { semester4Experiments } = require('../frontend/src/data/semester4');
const { semester5Experiments } = require('../frontend/src/data/semester5');
const { semester6Experiments } = require('../frontend/src/data/semester6');
const { semester7Experiments } = require('../frontend/src/data/semester7');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

const importData = async () => {
  try {
    console.log('🔌 Connecting to PostgreSQL...');
    
    // 1. Clear existing data
    await pool.query('DELETE FROM experiments');
    console.log('🗑️  Old data cleared.');

    // 2. Combine all data
    const allExperiments = [
      ...semester2Experiments,
      ...semester3Experiments,
      ...semester4Experiments,
      ...semester5Experiments,
      ...semester6Experiments,
      ...semester7Experiments,
    ];

    console.log(`🚀 Importing ${allExperiments.length} experiments...`);

    // 3. Insert loop
    for (const exp of allExperiments) {
        // Convert JS objects to JSON strings for JSONB columns
        const materialsJson = JSON.stringify(exp.requiredMaterials);
        // Postgres handles array of strings automatically for text[] columns
        
        // Calculate semester if missing (e.g. 201 -> 2)
        const sem = exp.semester || Math.floor(exp.id / 100);

        const query = `
            INSERT INTO experiments (
                id, semester, title, description, duration, team_size, difficulty, 
                summary, learning_objectives, safety_precautions, procedure_steps, 
                observation_columns, required_materials, simulator_url, image_url
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        `;

        const values = [
            exp.id,
            sem,
            exp.title,
            exp.description,
            exp.duration,
            exp.teamSize,
            exp.difficulty,
            exp.summary,
            exp.learningObjectives,
            exp.safetyPrecautions,
            exp.procedure,          // database column is procedure_steps
            exp.observationColumns,
            materialsJson,          // database column is required_materials (JSONB)
            exp.simulatorUrl || null,
            exp.imageUrl || null
        ];

        await pool.query(query, values);
    }

    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error with data import:', error);
    process.exit(1);
  }
};

importData();