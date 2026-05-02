import React from 'react';

const DEFAULT_SIM_URL = "https://www.falstad.com/circuit/circuitjs.html";

/**
 * @param {object} props
 * @param {string} [props.src] - Optional URL for a pre-built circuit.
 */
const SimulatorEmbed = ({ src = DEFAULT_SIM_URL }) => {
  return (
    <div className="simulator-wrapper">
      {/* This container handles the 4:3 Aspect Ratio (the video shape) */}
      <div className="simulator-container"> 
        <iframe
          src={src}
          title="Falstad Circuit Simulator"
          className="simulator-iframe" 
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          loading="lazy"
        >
          Loading circuit simulator...
        </iframe>
      </div>

      {/* This section appears BELOW the simulator */}
      <div className="simulator-acknowledgment">
        <p>
          <strong>Circuit Analysis Tool:</strong> This interactive feature is powered by 
          <strong> Falstad's Circuit Simulator</strong>, a powerful, open-source educational resource. 
          We greatly appreciate this contribution to the learning community.
        </p>
        <a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener noreferrer" className="sim-link">
          Visit Original Simulator Website &rarr;
        </a>
      </div>
    </div>
  );
};

export default SimulatorEmbed;