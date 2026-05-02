import { semester2Experiments } from './semester2';
import { semester3Experiments } from './semester3';
import { semester4Experiments } from './semester4';
import { semester5Experiments } from './semester5';
import { semester6Experiments } from './semester6';
import { semester7Experiments } from './semester7';

// CORRECTED: Use the spread (...) operator to combine arrays
const allExperiments = [
      ...semester2Experiments,
      ...semester3Experiments,
      ...semester4Experiments,
      ...semester5Experiments,
      ...semester6Experiments,
      ...semester7Experiments,
];

// Re-create the experimentDetails object that your component expects
const experimentDetailsById = allExperiments.reduce((acc, exp) => {
  acc[exp.id] = exp; // Now 'exp' is a single experiment object with an 'id'
  return acc;
}, {});

// This is the final data object that will be exported
export const labData = {
  semesters: [
    { id: 2, title: 'Semester 2', description: 'Electrical Engineering experiments for semester 2', experimentCount: semester2Experiments.length },
    { id: 3, title: 'Semester 3', description: 'Electrical Engineering experiments for semester 3', experimentCount: semester3Experiments.length },
    { id: 4, title: 'Semester 4', description: 'Electrical Engineering experiments for semester 4', experimentCount: semester4Experiments.length },
    { id: 5, title: 'Semester 5', description: 'Electrical Engineering experiments for semester 5', experimentCount: semester5Experiments.length },
    { id: 6, title: 'Semester 6', description: 'Electrical Engineering experiments for semester 6', experimentCount: semester6Experiments.length },
    { id: 7, title: 'Semester 7', description: 'Electrical Engineering experiments for semester 7', experimentCount: semester7Experiments.length },
  ],
  experiments: {
    2: semester2Experiments,
    3: semester3Experiments,
    4: semester4Experiments,
    5: semester5Experiments,
    6: semester6Experiments,
    7: semester7Experiments,
  },
  experimentDetails: experimentDetailsById, // This will now be correctly populated
};