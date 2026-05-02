export const semester2Experiments = [
  { 
    id: 201, 
    title: 'Experiment 1: Resistance Measurement', 
    description: "Measurement of low and high resistance of DC shunt motor windings.", 
    duration: '2 hours', 
    teamSize: 4, 
    difficulty: 'Basic',
    summary: 'This experiment focuses on measuring the low resistance of armature windings and high resistance of shunt field windings using the Voltmeter-Ammeter method. It verifies Ohm\'s law where R = V/I.',
    learningObjectives: [
      'Measure low resistance of armature winding',
      'Measure high resistance of shunt field winding',
      'Understand the Voltage-Current method'
    ],
    requiredMaterials: [
      { name: 'DC Voltmeter', specification: '0-25V, 0-250V', quantity: '2' },
      { name: 'DC Ammeter', specification: '0-1A, 0-15A', quantity: '2' },
      { name: 'Lamp Load', specification: '200W, 250V', quantity: '1' },
      { name: 'Rheostat', specification: '300Ω, 1A', quantity: '1' },
      { name: 'DC Supply', specification: '230V', quantity: '1' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'S. No.', 'Voltage (V)', 'Current (I)', 'Resistance (R = V/I)', 'Average R'
    ],
    safetyPrecautions: [
      'Ensure tight connections before switching on supply',
      'Select correct range of Ammeter and Voltmeter',
      'Do not touch live terminals'
    ],
    procedure: [
      'Connect the circuit as per the diagram for Low Resistance measurement.',
      'Vary the rheostat/load to take different readings of V and I.',
      'Calculate R for each reading.',
      'Repeat the procedure for the High Resistance setup.',
      'Plot V-I characteristics.'
    ]
  },
  { 
    id: 202, 
    title: 'Experiment 2A: AC Series R-L-C', 
    description: "Analysis of voltage and current distribution in a Series R-L-C circuit.", 
    duration: '3 hours', 
    teamSize: 4, 
    difficulty: 'Intermediate',
    summary: 'Study the phase relationships in a series circuit consisting of Resistance, Inductance, and Capacitance. Verify that VL leads current by 90° and VC lags current by 90°.',
    learningObjectives: [
      'Obtain current and voltage distribution',
      'Draw the phasor diagram',
      'Understand impedance triangles'
    ],
    requiredMaterials: [
      { name: 'Auto Transformer', specification: '1-phase, 230V', quantity: '1' },
      { name: 'Rheostat', specification: '200Ω, 1.8A', quantity: '1' },
      { name: 'Choke Coil', specification: '4H', quantity: '1' },
      { name: 'Capacitor', specification: '4µF', quantity: '1' },
      { name: 'AC Ammeter', specification: '0-3A', quantity: '1' },
      { name: 'AC Voltmeter', specification: '0-250V', quantity: '1' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'S. No.', 'Current (I)', 'Line Voltage (V)', 'VR', 'V_coil', 'V_RL', 'VC'
    ],
    safetyPrecautions: [
      'Do not exceed the current rating of the rheostat',
      'Discharge capacitor after experiment'
    ],
    procedure: [
      'Connect the R, L, and C in series across the auto-transformer.',
      'Gradually increase voltage and note readings of current and voltages.',
      'Draw the phasor diagram using the readings.',
      'Calculate power factor.'
    ]
  },
  { 
    id: 203, 
    title: 'Experiment 2B: 3-Voltmeter Method', 
    description: "Measurement of power and power factor using 3 voltmeters.", 
    duration: '2 hours', 
    teamSize: 4, 
    difficulty: 'Intermediate',
    summary: 'A known resistance is connected in series with a choke coil. By measuring three voltages (Supply, across R, across Coil), the power consumption and power factor of the coil can be determined.',
    learningObjectives: [
      'Measure power of single phase load',
      'Determine power factor without wattmeter',
      'Analyze phasor relationships'
    ],
    requiredMaterials: [
      { name: 'Auto Transformer', specification: '1-phase', quantity: '1' },
      { name: 'Rheostat', specification: '200Ω, 2.8A', quantity: '1' },
      { name: 'Choke Coil', specification: '4H', quantity: '1' },
      { name: 'AC Ammeter', specification: '0-3A', quantity: '1' },
      { name: 'AC Voltmeter', specification: '0-300V, 0-40V', quantity: '3' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'S. No.', 'V_Line', 'Current (I)', 'V_Resistor (VR)', 'V_Coil (VL)', 'Calc Power'
    ],
    safetyPrecautions: [
      'Ensure common ground connection',
      'Take readings quickly to avoid heating'
    ],
    procedure: [
      'Connect the circuit with R and L in series.',
      'Connect voltmeters across Supply, R, and L.',
      'Vary the current and record the three voltage readings.',
      'Construct the phasor triangle to find the angle Phi.'
    ]
  },
  { 
    id: 204, 
    title: 'Experiment 3A: AC Parallel R-L-C', 
    description: "Study of current distribution in parallel AC circuits.", 
    duration: '3 hours', 
    teamSize: 4, 
    difficulty: 'Advanced',
    summary: 'In a parallel circuit, voltage remains common while currents divide. This experiment verifies that capacitor current leads voltage while inductor current lags.',
    learningObjectives: [
      'Analyze parallel AC circuits',
      'Verify Kirchhoff’s Current Law for AC',
      'Draw phasor diagram for currents'
    ],
    requiredMaterials: [
      { name: 'Auto Transformer', specification: '1-phase', quantity: '1' },
      { name: 'Rheostat', specification: '200Ω, 1.8A', quantity: '1' },
      { name: 'Choke Coil', specification: '4H', quantity: '1' },
      { name: 'Capacitor', specification: '4µF', quantity: '1' },
      { name: 'AC Ammeters', specification: '0-1A, 0-3A', quantity: '3' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'S. No.', 'Voltage (V)', 'I_Line', 'I_Resistor', 'I_Inductor', 'I_Capacitor'
    ],
    safetyPrecautions: [
      'Watch out for parallel resonance (high impedance)',
      'Ensure ammeters are in series with branches'
    ],
    procedure: [
      'Connect R, L, and C in parallel across the supply.',
      'Connect ammeters in each branch and one in the main line.',
      'Vary voltage and record all current readings.',
      'Verify vector sum of branch currents equals line current.'
    ]
  },
  { 
    id: 205, 
    title: 'Experiment 4: Series Resonance', 
    description: "Study of resonance phenomenon in R-L-C series circuit.", 
    duration: '3 hours', 
    teamSize: 3, 
    difficulty: 'Intermediate',
    summary: 'At resonance frequency, inductive reactance equals capacitive reactance, minimizing impedance and maximizing current. This experiment plots the resonance curve.',
    learningObjectives: [
      'Find resonant frequency',
      'Determine Bandwidth and Q-factor',
      'Plot Frequency Response curve'
    ],
    requiredMaterials: [
      { name: 'Signal Generator', specification: 'Sine Wave', quantity: '1' },
      { name: 'Inductor', specification: 'Standard', quantity: '1' },
      { name: 'Capacitor', specification: 'Standard', quantity: '1' },
      { name: 'Resistor', specification: 'Standard', quantity: '1' },
      { name: 'AC Ammeter', specification: '0-1A', quantity: '1' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'Frequency (Hz)', 'Current (I)', 'V_L', 'V_C', 'V_R'
    ],
    safetyPrecautions: [
      'Voltages across L and C can exceed supply voltage at resonance',
      'Use proper scale for frequency generation'
    ],
    procedure: [
      'Connect R, L, C in series with the signal generator.',
      'Keep input voltage constant and vary frequency.',
      'Record current peaking at resonant frequency.',
      'Plot Current vs Frequency.'
    ]
  },
  { 
    id: 206, 
    title: 'Experiment 5: 3-Phase Star Connection', 
    description: "Relation between Line and Phase quantities in Star connection.", 
    duration: '2 hours', 
    teamSize: 4, 
    difficulty: 'Basic',
    summary: 'Verification of the relationship VL = √3 * VP and IL = IP for a balanced star-connected load.',
    learningObjectives: [
      'Understand Star connection topology',
      'Verify Line vs Phase voltage relationship',
      'Draw phasor diagram for Star system'
    ],
    requiredMaterials: [
      { name: '3-Phase Auto Transformer', specification: '-', quantity: '1' },
      { name: 'Voltmeter', specification: '0-500V', quantity: '1' },
      { name: 'Ammeter', specification: '0-10A', quantity: '1' },
      { name: 'Lamp Load', specification: '3-Phase', quantity: '1' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'S. No.', 'I_Line', 'V_Phase', 'V_Line', 'Ratio (VL/VP)'
    ],
    safetyPrecautions: [
      'Ensure neutral connection is tight',
      'Handle high voltage (440V) with extreme care'
    ],
    procedure: [
      'Connect the lamp load in Star configuration.',
      'Measure Line Voltage (R-Y) and Phase Voltage (R-N).',
      'Vary load and repeat measurements.',
      'Calculate ratio VL/VP and compare with √3 (1.732).'
    ]
  },
  { 
    id: 207, 
    title: 'Experiment 6: 3-Phase Delta Connection', 
    description: "Relation between Line and Phase quantities in Delta connection.", 
    duration: '2 hours', 
    teamSize: 4, 
    difficulty: 'Basic',
    summary: 'Verification of the relationship IL = √3 * IP and VL = VP for a balanced delta-connected load.',
    learningObjectives: [
      'Understand Delta connection topology',
      'Verify Line vs Phase current relationship',
      'Draw phasor diagram for Delta system'
    ],
    requiredMaterials: [
      { name: '3-Phase Auto Transformer', specification: '-', quantity: '1' },
      { name: 'Voltmeter', specification: '0-500V', quantity: '1' },
      { name: 'Ammeters', specification: '0-10A', quantity: '2' },
      { name: 'Lamp Load', specification: '3-Phase', quantity: '1' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'S. No.', 'V_Line', 'I_Phase', 'I_Line', 'Ratio (IL/IP)'
    ],
    safetyPrecautions: [
      'Ensure closed loop in Delta connection',
      'Do not open the delta loop while powered'
    ],
    procedure: [
      'Connect the lamp load in Delta configuration.',
      'Measure Line Current and Phase Current.',
      'Calculate ratio IL/IP and compare with √3 (1.732).'
    ]
  },
  { 
    id: 208, 
    title: 'Experiment 7: 3-Phase Power Measurement', 
    description: "Measurement of 3-Phase power using Two Wattmeter Method.", 
    duration: '3 hours', 
    teamSize: 4, 
    difficulty: 'Intermediate',
    summary: 'The algebraic sum of two wattmeters gives total power in a 3-phase circuit. This experiment validates the method and calculates power factor from readings.',
    learningObjectives: [
      'Measure total 3-phase power',
      'Calculate power factor angle',
      'Understand effect of load power factor on wattmeter readings'
    ],
    requiredMaterials: [
      { name: 'Wattmeters', specification: '10A, 500V', quantity: '2' },
      { name: 'Ammeter', specification: '0-10A', quantity: '1' },
      { name: 'Voltmeter', specification: '0-500V', quantity: '1' },
      { name: '3-Phase Induction Motor', specification: 'Load', quantity: '1' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'S. No.', 'Current (I)', 'Wattmeter 1 (W1)', 'Wattmeter 2 (W2)', 'Total Power', 'PF Angle'
    ],
    safetyPrecautions: [
      'Check wattmeter current/voltage coil connections',
      'Do not exceed rated current'
    ],
    procedure: [
      'Connect two wattmeters in the lines of a 3-phase load.',
      'Vary the load on the motor.',
      'Record W1 and W2 readings (reverse coil if deflection is negative).',
      'Calculate Total Power = W1 + W2.'
    ]
  },
  { 
    id: 209, 
    title: 'Experiment 8: Inductance Measurement', 
    description: "Determination of Self and Mutual Inductance of coils.", 
    duration: '3 hours', 
    teamSize: 4, 
    difficulty: 'Advanced',
    summary: 'Using Series Addition and Series Opposition methods to calculate the coefficient of coupling and mutual inductance between two coils.',
    learningObjectives: [
      'Determine Self Inductance (L)',
      'Determine Mutual Inductance (M)',
      'Verify laws of series magnetic circuits'
    ],
    requiredMaterials: [
      { name: 'Inductive Coils', specification: 'Pair', quantity: '2' },
      { name: 'Auto Transformer', specification: '-', quantity: '1' },
      { name: 'Ammeters', specification: 'AC/DC', quantity: '2' },
      { name: 'Voltmeters', specification: 'AC/DC', quantity: '2' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'Connection', 'Voltage (V)', 'Current (I)', 'Impedance (Z)', 'Inductance (L/M)'
    ],
    safetyPrecautions: [
      'Keep coils aligned for max coupling',
      'Measure DC resistance accurately'
    ],
    procedure: [
      'Measure DC resistance of coils.',
      'Connect coils in Series Addition (fluxes add) and measure impedance.',
      'Connect coils in Series Opposition (fluxes oppose) and measure impedance.',
      'Calculate M using the formula derived in theory.'
    ]
  },
  { 
    id: 210, 
    title: 'Experiment 9: Network Theorems', 
    description: "Verification of Superposition, Thevenin, and Norton Theorems.", 
    duration: '3 hours', 
    teamSize: 4, 
    difficulty: 'Intermediate',
    summary: 'Experimental verification of fundamental circuit theorems for DC circuits, enabling simplification of complex networks.',
    learningObjectives: [
      'Verify Superposition Theorem',
      'Determine Thevenin Voltage and Resistance',
      'Verify Norton Equivalent Circuit'
    ],
    requiredMaterials: [
      { name: 'DC Power Supply', specification: 'Dual Channel', quantity: '1' },
      { name: 'Breadboard', specification: '-', quantity: '1' },
      { name: 'Resistors', specification: 'Various', quantity: 'Set' },
      { name: 'Multimeter', specification: '-', quantity: '1' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    observationColumns: [
      'Theorem', 'Parameter', 'Theoretical Value', 'Measured Value', '% Error'
    ],
    safetyPrecautions: [
      'Ensure proper short/open circuits for theorem steps',
      'Do not exceed component power ratings'
    ],
    procedure: [
      'For Superposition: Activate one source at a time and sum responses.',
      'For Thevenin: Measure open circuit voltage and equivalent resistance.',
      'For Norton: Measure short circuit current.',
      'Compare all results with theoretical calculations.'
    ]
  }
];