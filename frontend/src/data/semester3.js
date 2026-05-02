export const semester3Experiments = [
  { 
    id: 301, 
    title: 'Experiment 1', 
    description: "Verification of Kirchhoff's Current Law (KCL) and Voltage Law (KVL)", 
    duration: '2 hours', 
    teamSize: 4, 
    difficulty: 'Basic',
    summary: 'Experimental verification of the fundamental laws of conservation of charge and energy in electrical circuits using KCL and KVL.',
    learningObjectives: [
      'Verify Kirchhoff’s Current Law in a node',
      'Verify Kirchhoff’s Voltage Law in a loop',
      'Compare theoretical values with measured values',
    ],
    requiredMaterials: [
      { name: 'Digital Multimeter', specification: 'Standard', quantity: '1' },
      { name: 'DC Power Supply', specification: '0-30V', quantity: '1' },
      { name: 'Breadboard', specification: '-', quantity: '1' },
      { name: 'Resistors', specification: '1kΩ, 2.2kΩ, 3.3kΩ', quantity: '3' },
      { name: 'Connecting Wires', specification: '-', quantity: 'Set' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'Serial No.',
      'Applied Voltage (V)',
      'Theoretical Current (mA)',
      'Measured Current (mA)',
      '% Error'
    ],
    safetyPrecautions: [
      'Check circuit connections before switching on power',
      'Ensure multimeter is in correct mode (A vs V)',
      'Do not exceed resistor power ratings'
    ],
    procedure: [
      'Connect the circuit as per the KCL circuit diagram.',
      'Apply a DC voltage from the regulated power supply.',
      'Measure the currents in all branches using the ammeter.',
      'Verify that the algebraic sum of currents at the node is zero.',
      'Repeat the procedure for the KVL circuit by measuring voltage drops.',
    ]
  },

  { 
    id: 302, 
    title: 'Experiment 2', 
    description: "Verification of Superposition Theorem", 
    duration: '3 hours', 
    teamSize: 4, 
    difficulty: 'Intermediate',
    summary: 'Analyzing a linear bilateral network containing more than one source to verify that the response is the sum of responses from individual sources.',
    learningObjectives: [
      'Understand linearity in electrical circuits',
      'Analyze circuits with multiple active sources',
      'Verify the Superposition principle experimentally',
    ],
    requiredMaterials: [
      { name: 'DC Power Supply', specification: 'Dual Channel', quantity: '1' },
      { name: 'Digital Multimeter', specification: '-', quantity: '1' },
      { name: 'Breadboard', specification: '-', quantity: '1' },
      { name: 'Resistors', specification: 'Various Values', quantity: '5' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'Parameter',
      'Source V1 Active (V2=0)',
      'Source V2 Active (V1=0)',
      'Both V1 & V2 Active',
      'Calculated (V1+V2)'
    ],
    safetyPrecautions: [
      'Short circuit voltage sources properly when deactivating',
      'Open circuit current sources properly when deactivating',
      'Avoid loose connections'
    ],
    procedure: [
      'Connect the circuit with both voltage sources V1 and V2.',
      'Measure current/voltage across the load resistor.',
      'Turn off V2 (short circuit it) and measure response due to V1 alone.',
      'Turn off V1 (short circuit it) and measure response due to V2 alone.',
      'Verify if the total response equals the sum of individual responses.'
    ]
  },

  { 
    id: 303, 
    title: 'Experiment 3', 
    description: "Verification of Thevenin's Theorem", 
    duration: '3 hours', 
    teamSize: 4, 
    difficulty: 'Intermediate',
    summary: 'Simplifying a complex linear circuit into an equivalent voltage source (Vth) in series with an equivalent resistance (Rth).',
    learningObjectives: [
      'Determine Thevenin Voltage (Vth)',
      'Determine Thevenin Resistance (Rth)',
      'Verify load current using the equivalent circuit',
    ],
    requiredMaterials: [
      { name: 'DC Power Supply', specification: '0-30V', quantity: '1' },
      { name: 'Multimeter', specification: '-', quantity: '1' },
      { name: 'Resistors', specification: 'Fixed & Variable', quantity: 'Set' },
      { name: 'Breadboard', specification: '-', quantity: '1' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'Load Resistance (RL)',
      'Measured Vth (V)',
      'Measured Rth (Ω)',
      'Load Current (IL) - Circuit',
      'Load Current (IL) - Calc'
    ],
    safetyPrecautions: [
      'Ensure accurate open-circuit voltage measurement',
      'Power off circuit before measuring resistance',
    ],
    procedure: [
      'Remove the load resistor RL from the circuit.',
      'Measure the Open Circuit Voltage (Vth) across the terminals.',
      'Deactivate sources and measure equivalent resistance (Rth).',
      'Construct the Thevenin equivalent circuit and verify current through RL.'
    ]
  },

  { 
    id: 304, 
    title: 'Experiment 4', 
    description: "Verification of Norton's Theorem", 
    duration: '3 hours', 
    teamSize: 4, 
    difficulty: 'Intermediate',
    summary: 'Converting a complex circuit into a simple current source (IN) in parallel with an equivalent resistance (RN).',
    learningObjectives: [
      'Calculate Short Circuit Current (Isc)',
      'Verify Norton’s equivalent circuit',
      'Compare with Thevenin’s equivalent',
    ],
    requiredMaterials: [
      { name: 'Ammeters', specification: '0-300mA', quantity: '2' },
      { name: 'Voltmeter', specification: '0-30V', quantity: '1' },
      { name: 'Rheostat', specification: '50Ω/2A', quantity: '1' },
      { name: 'Regulated Power Supply', specification: '-', quantity: '1' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'Step',
      'Short Circuit Current (IN)',
      'Norton Resistance (RN)',
      'Load Current (IL) Measured',
      'Load Current (IL) Calculated'
    ],
    safetyPrecautions: [
      'Do not keep the ammeter connected in parallel',
      'Avoid long duration short-circuits to prevent heating'
    ],
    procedure: [
      'Short the load terminals and measure the short-circuit current (IN).',
      'Calculate the equivalent resistance (RN) by looking back into the terminals.',
      'Set up the Norton equivalent circuit.',
      'Verify the current through the load resistor matches the original circuit.'
    ]
  },

  { 
    id: 305, 
    title: 'Experiment 5', 
    description: "Maximum Power Transfer Theorem", 
    duration: '2 hours', 
    teamSize: 3, 
    difficulty: 'Basic',
    summary: 'Determining the load resistance required to extract maximum power from a DC source with internal resistance.',
    learningObjectives: [
      'Plot Power vs. Load Resistance curve',
      'Determine the condition for Max Power Transfer',
    ],
    requiredMaterials: [
      { name: 'Variable Resistance Box (DRB)', specification: '-', quantity: '1' },
      { name: 'DC Power Supply', specification: '-', quantity: '1' },
      { name: 'Multimeter', specification: '-', quantity: '1' },
      { name: 'Resistor', specification: 'Source Resistance', quantity: '1' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'Load Resistance (RL)',
      'Voltage across Load (V)',
      'Current (I)',
      'Power (P = V*I)',
      'Is P Maximum?'
    ],
    safetyPrecautions: [
      'Vary the load resistance gradually',
      'Note readings carefully near the peak power point'
    ],
    procedure: [
      'Set up the circuit with a fixed source resistance.',
      'Vary the variable load resistor (RL) in steps.',
      'Measure voltage and current for each step.',
      'Calculate Power (P) and identify the peak.',
      'Verify that peak power occurs when RL equals source resistance.'
    ]
  },

  { 
    id: 306, 
    title: 'Experiment 6', 
    description: "Transient Response of RC Circuit", 
    duration: '3 hours', 
    teamSize: 4, 
    difficulty: 'Advanced',
    summary: 'Analyzing the charging and discharging behavior of a capacitor through a resistor and determining the time constant.',
    learningObjectives: [
      'Visualize transient exponential curves',
      'Calculate Time Constant (Tau)',
      'Understand capacitor energy storage',
    ],
    requiredMaterials: [
      { name: 'Digital Oscilloscope', specification: 'DSO', quantity: '1' },
      { name: 'Function Generator', specification: 'Square Wave', quantity: '1' },
      { name: 'Breadboard', specification: '-', quantity: '1' },
      { name: 'Capacitor', specification: '1µF', quantity: '1' },
      { name: 'Resistor', specification: '1kΩ', quantity: '1' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'Time (ms)',
      'Charging Voltage (Vc)',
      'Discharging Voltage (Vd)',
      'Calculated Time Constant',
      'Measured Time Constant'
    ],
    safetyPrecautions: [
      'Ensure capacitor polarity is correct (if electrolytic)',
      'Set function generator to low frequency (e.g., 50Hz-100Hz)'
    ],
    procedure: [
      'Connect the series RC circuit.',
      'Apply a square wave input from the function generator.',
      'Observe the voltage across the capacitor on the CRO/DSO.',
      'Measure the time taken to reach 63.2% of max voltage (Time Constant).',
      'Compare with theoretical value T = R*C.'
    ]
  },

  { 
    id: 307, 
    title: 'Experiment 7', 
    description: "Series Resonance in R-L-C Circuit", 
    duration: '3 hours', 
    teamSize: 4, 
    difficulty: 'Advanced',
    summary: 'Studying the frequency response of a series RLC circuit and determining the resonant frequency and Q-factor.',
    learningObjectives: [
      'Determine Resonant Frequency (fr)',
      'Calculate Bandwidth and Q-factor',
      'Plot Current vs Frequency curve',
    ],
    requiredMaterials: [
      { name: 'Signal Generator', specification: 'Sine Wave', quantity: '1' },
      { name: 'Inductor', specification: 'mH range', quantity: '1' },
      { name: 'Capacitor', specification: 'µF range', quantity: '1' },
      { name: 'Resistor', specification: '100Ω', quantity: '1' },
      { name: 'Multimeter/CRO', specification: '-', quantity: '1' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'Frequency (Hz)',
      'Input Voltage (Vin)',
      'Resistor Voltage (VR)',
      'Current (I = VR/R)',
      'Impedance (Z)'
    ],
    safetyPrecautions: [
      'Maintain constant input voltage throughout the experiment',
      'Take more readings near the resonance frequency'
    ],
    procedure: [
      'Connect R, L, and C in series across the signal generator.',
      'Vary the frequency from 100Hz to 10kHz in steps.',
      'Measure voltage across the resistor to calculate current.',
      'Identify the frequency where current is maximum (Resonance).',
      'Plot the response curve and calculate Bandwidth.'
    ]
  },

  { 
    id: 308, 
    title: 'Experiment 8', 
    description: "Two-Port Network Parameters (Z and Y)", 
    duration: '3 hours', 
    teamSize: 4, 
    difficulty: 'Advanced',
    summary: 'Determining the Impedance (Z) and Admittance (Y) parameters of a two-port linear passive network.',
    learningObjectives: [
      'Measure Z-parameters (Open Circuit)',
      'Measure Y-parameters (Short Circuit)',
      'Verify reciprocity and symmetry',
    ],
    requiredMaterials: [
      { name: 'Two-Port Network Kit', specification: 'T or Pi network', quantity: '1' },
      { name: 'Regulated Power Supply', specification: '-', quantity: '2' },
      { name: 'Multimeters', specification: '-', quantity: '2' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'Port Condition',
      'Input Voltage (V)',
      'Input Current (I)',
      'Output Voltage (V)',
      'Parameter Value'
    ],
    safetyPrecautions: [
      'Ensure tight connections on the network kit',
      'Do not exceed rated current of the components'
    ],
    procedure: [
      'For Z-params: Open circuit output port, apply voltage to input, measure currents/voltages.',
      'Repeat by opening input port and driving output.',
      'For Y-params: Short circuit ports alternatively and measure currents.',
      'Calculate parameters using standard formulas.'
    ]
  },
];