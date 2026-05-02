// src/data.js

const genericDetails = {
  summary: 'This is a placeholder summary. Please edit the details for this experiment in src/data.js.',
  learningObjectives: [
    'Objective 1: Add specific learning objectives.',
    'Objective 2: This makes the experiment page functional.',
    'Objective 3: You can define unique details for each experiment ID.',
  ],
  requiredMaterials: ['Material 1', 'Material 2', 'Breadboard', 'Multimeter'],
  safetyPrecautions: ['Always follow standard lab safety protocols.'],
  procedure: [
    'Set up the equipment as per the schematic.',
    'Take initial readings.',
    'Perform the experiment steps.',
    'Record all data accurately.',
    'Clean up the workspace.',
  ],
};

export const labData = {
  semesters: [
    { id: 1, title: 'Semester 1', description: 'Electrical Engineering experiments for semester 1', experimentCount: 10 },
    { id: 2, title: 'Semester 2', description: 'Electrical Engineering experiments for semester 2', experimentCount: 10 },
    { id: 3, title: 'Semester 3', description: 'Electrical Engineering experiments for semester 3', experimentCount: 10 },
    { id: 4, title: 'Semester 4', description: 'Electrical Engineering experiments for semester 4', experimentCount: 10 },
    { id: 5, title: 'Semester 5', description: 'Electrical Engineering experiments for semester 5', experimentCount: 10 },
    { id: 6, title: 'Semester 6', description: 'Electrical Engineering experiments for semester 6', experimentCount: 10 },
    { id: 7, title: 'Semester 7', description: 'Electrical Engineering experiments for semester 7', experimentCount: 10 },
    { id: 8, title: 'Semester 8', description: 'Electrical Engineering experiments for semester 8', experimentCount: 10 },
  ],
  experiments: {
    1: [
      { id: 101, title: 'Experiment 1', description: "Basic circuit analysis using Ohm's law and Kirchhoff's laws", duration: '4h', teamSize: 2, difficulty: 'Basic' },
      { id: 102, title: 'Experiment 2', description: 'Measurement of AC and DC voltage using multimeter', duration: '2h', teamSize: 3, difficulty: 'Intermediate' },
      { id: 103, title: 'Experiment 3', description: 'Study of resistor color codes and tolerance values', duration: '4h', teamSize: 3, difficulty: 'Basic' },
      { id: 104, title: 'Experiment 4', description: 'Series and parallel circuit configurations', duration: '3h', teamSize: 2, difficulty: 'Advanced' },
      { id: 105, title: 'Experiment 5', description: 'Introduction to oscilloscope and function generator', duration: '4h', teamSize: 4, difficulty: 'Advanced' },
      { id: 106, title: 'Experiment 6', description: 'Measurement of current using ammeter and clamp meter', duration: '4h', teamSize: 4, difficulty: 'Basic' },
      { id: 107, title: 'Experiment 7', description: 'Power calculations in electrical circuits', duration: '4h', teamSize: 2, difficulty: 'Intermediate' },
      { id: 108, title: 'Experiment 8', description: 'Introduction to breadboard and circuit construction', duration: '4h', teamSize: 3, difficulty: 'Basic' },
      { id: 109, title: 'Experiment 9', description: 'Study of electrical safety and laboratory protocols', duration: '4h', teamSize: 2, difficulty: 'Basic' },
    ],
    2: [
      { id: 201, title: 'Experiment 1', description: 'Thevenin\'s and Norton\'s Theorems', duration: '4h', teamSize: 2, difficulty: 'Intermediate' },
      { id: 202, title: 'Experiment 2', description: 'Maximum Power Transfer Theorem', duration: '3h', teamSize: 2, difficulty: 'Intermediate' },
      // ... add more experiments for semester 2
    ],
    3: [
      { id: 301, title: 'Experiment 1', description: 'RLC Circuit Analysis', duration: '4h', teamSize: 3, difficulty: 'Advanced' },
      // ... add more experiments for semester 3
    ],
    4: [{ id: 401, title: 'Experiment 1', description: 'Diode Characteristics', duration: '3h', teamSize: 2, difficulty: 'Basic' }],
    5: [{ id: 501, title: 'Experiment 1', description: 'Transistor Biasing', duration: '4h', teamSize: 2, difficulty: 'Intermediate' }],
    6: [{ id: 601, title: 'Experiment 1', description: 'Operational Amplifiers', duration: '4h', teamSize: 3, difficulty: 'Advanced' }],
    7: [{ id: 701, title: 'Experiment 1', description: 'Digital Logic Gates', duration: '3h', teamSize: 4, difficulty: 'Basic' }],
    8: [{ id: 801, title: 'Experiment 1', description: 'Microcontroller Programming', duration: '5h', teamSize: 2, difficulty: 'Advanced' }],
  },
  experimentDetails: {
    101: {
      title: 'Experiment 1',
      duration: '3 hours',
      participants: '4 participants',
      difficulty: 'Basic',
      summary: 'An in-depth exploration of AC circuit behavior, including impedance calculations, phase relationships, and power analysis. This experiment bridges the gap between theory and practice in alternating current systems.',
      learningObjectives: [
        'Understand the fundamental principles of electrical circuit analysis',
        'Learn to use laboratory equipment safely and effectively',
        'Develop skills in electrical measurement and data collection',
        'Analyze experimental results and compare with theoretical predictions',
        'Practice professional laboratory reporting and documentation',
      ],
      requiredMaterials: [
        'Digital Multimeter', 'Oscilloscope', 'Function Generator', 'Breadboard', 'Resistors (various values)', 'Capacitors', 'Inductors', 'Connecting wires', 'Power supply', 'Graph paper'
      ],
      safetyPrecautions: [
        'Always check equipment before use', 'Never exceed maximum voltage ratings', 'Keep workspace clean and organized', 'Wear appropriate safety equipment', 'Double-check connections before powering on'
      ],
      procedure: [
        'Set up the laboratory equipment and ensure all safety protocols are followed',
        'Construct the circuit according to the provided schematic diagram',
        'Verify all connections and component values before applying power',
        'Take initial measurements and record baseline values',
        'Apply the specified input signals and measure corresponding outputs',
        'Vary the input parameters systematically and record all measurements',
        'Analyze the collected data and compare with theoretical calculations',
        'Document any observations, anomalies, or unexpected results',
        'Clean up the workspace and properly store all equipment',
      ]
    },
    // Add generic details for other experiments so they have content
    102: { ...genericDetails, title: 'Experiment 2', duration: '2h', participants: '3 people', difficulty: 'Intermediate' },
    201: { ...genericDetails, title: 'Experiment 1', duration: '4h', participants: '2 people', difficulty: 'Intermediate' },
    301: { ...genericDetails, title: 'Experiment 1', duration: '4h', participants: '3 people', difficulty: 'Advanced' },
    // TO ADD MORE: Copy the pattern above for any experiment ID.
    // Example: 401: { ...genericDetails, title: 'Diode Characteristics', ... },
  }
};