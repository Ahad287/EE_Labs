import React, { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import axios from 'axios';

const ObservationTable = ({ initialColumns, experimentId }) => {
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([{}, {}, {}]);
  
  // --- Unified Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null = Add New, number = Edit Existing
  const [colName, setColName] = useState('');
  const [colType, setColType] = useState('raw'); // 'raw' or 'calculated'
  const [colFormula, setColFormula] = useState('');
  const [formulaError, setFormulaError] = useState('');

  // Initialize columns from database
  useEffect(() => {
    if (initialColumns && initialColumns.length > 0) {
      setCols(initialColumns.map(name => ({ name, isCalculated: false, formula: '' })));
    }
  }, [initialColumns]);

  // Recalculate formulas
  const recalculateRow = (row, currentCols) => {
    const updatedRow = { ...row };
    
    // Build the variable dictionary (C1, C2, C3...)
    const scope = {};
    currentCols.forEach((col, idx) => {
      scope[`C${idx + 1}`] = parseFloat(updatedRow[col.name]) || 0;
    });

    currentCols.filter(c => c.isCalculated).forEach(calcCol => {
      try {
        let result = evaluate(calcCol.formula, scope);
        updatedRow[calcCol.name] = Number.isInteger(result) ? result : parseFloat(result.toFixed(3));
      } catch (e) {
        updatedRow[calcCol.name] = "Err";
      }
    });
    
    return updatedRow;
  };

  const handleCellChange = (rowIndex, columnName, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][columnName] = value;
    updatedRows[rowIndex] = recalculateRow(updatedRows[rowIndex], cols);
    setRows(updatedRows);
  };

  const addRow = () => setRows([...rows, {}]);

  // --- Modal Controllers ---
  const openAddModal = () => {
    setEditingIndex(null);
    setColName('');
    setColType('raw');
    setColFormula('');
    setFormulaError('');
    setIsModalOpen(true);
  };

  const openEditModal = (index) => {
    const existingCol = cols[index];
    setEditingIndex(index);
    setColName(existingCol.name);
    setColType(existingCol.isCalculated ? 'calculated' : 'raw');
    setColFormula(existingCol.formula || '');
    setFormulaError('');
    setIsModalOpen(true);
  };

  // --- Save Logic (Handles both Add and Edit) ---
  const handleSaveColumn = (e) => {
    e.preventDefault();
    if (!colName) return;

    let finalFormula = '';
    
    if (colType === 'calculated') {
      if (!colFormula) {
        setFormulaError("Formula is required for calculated columns.");
        return;
      }
      try {
        const testScope = {};
        cols.forEach((_, idx) => { testScope[`C${idx + 1}`] = 1; });
        evaluate(colFormula, testScope); // Test syntax
        finalFormula = colFormula;
      } catch (err) {
        setFormulaError("Invalid formula syntax. Use C1, C2, +, -, *, /, sqrt()");
        return;
      }
    }

    const newColData = { name: colName, isCalculated: colType === 'calculated', formula: finalFormula };
    let updatedCols = [...cols];

    if (editingIndex !== null) {
      // Editing existing column
      const oldName = updatedCols[editingIndex].name;
      updatedCols[editingIndex] = newColData;
      
      // If name changed, we need to migrate the data in the rows to the new key
      if (oldName !== colName) {
        const migratedRows = rows.map(row => {
          const newRow = { ...row, [colName]: row[oldName] };
          delete newRow[oldName];
          return newRow;
        });
        setRows(migratedRows.map(r => recalculateRow(r, updatedCols)));
      } else {
        setRows(rows.map(r => recalculateRow(r, updatedCols)));
      }
    } else {
      // Adding new column
      updatedCols.push(newColData);
      setRows(rows.map(r => recalculateRow(r, updatedCols)));
    }

    setCols(updatedCols);
    setIsModalOpen(false);
  };

  if (!cols || cols.length === 0) return null;

  const handleSaveData = async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      alert("You must be logged in to save your lab work!");
      return;
    }

    // Decode token to get User ID (or grab it from your global App state if passed as a prop)
    const base64Url = token.split('.')[1];
    const decodedToken = JSON.parse(atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Note: We need the actual user ID. Since we didn't put ID in the JWT earlier, 
    // we'll need to pass it, OR assuming we stored the user object in App state. 
    // Let's format the payload exactly how Java expects it.
    
   const payload = {
      experimentId: experimentId, // Uses the real ID passed from MainContent!
      observationData: { columns: cols, data: rows }, 
      falstadCircuitData: null 
    };

    try {
      await axios.post('http://localhost:8080/api/submissions/save', payload, {
        headers: {
          'Authorization': `Bearer ${token}` // This is how you pass the VIP Pass!
        }
      });
      alert("Lab data successfully saved to your dashboard!");
    } catch (error) {
      console.error(error);
      alert("Failed to save. Is your session expired?");
    }
  };

  return (
    <div className="observation-table-container">
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <button className="login-btn-top" style={{ position: 'relative', top: 0, right: 0, padding: '6px 12px', fontSize: '0.8rem' }} onClick={openAddModal}>
          + Add Column
        </button>
      </div>

      <div className="table-responsive">
        <table className="lab-table observation-table">
          <thead>
            <tr>
              {cols.map((col, index) => (
                <th 
                  key={index} 
                  onClick={() => openEditModal(index)} 
                  style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                  title="Click to Edit Column"
                  className="editable-th"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {col.name} 
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>✏️</span>
                  </div>
                  {col.isCalculated && <span style={{ fontSize: '0.7rem', display: 'block', color: '#ffb3b8' }}>ƒ = {col.formula}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {cols.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.isCalculated ? (
                      <div style={{ padding: '4px', fontWeight: '600', color: 'var(--accent-color)', textAlign: 'center' }}>
                        {row[col.name] !== undefined ? row[col.name] : '-'}
                      </div>
                    ) : (
                      <input
                        type="number"
                        className="table-input"
                        placeholder="-"
                        value={row[col.name] !== undefined ? row[col.name] : ''}
                        onChange={(e) => handleCellChange(rowIndex, col.name, e.target.value)}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="table-controls" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button className="add-row-btn" onClick={addRow} style={{ flex: 1 }}>+ Add Row</button>
        <button className="hero-button" onClick={handleSaveData}>
          Save to Dashboard
        </button>
      </div>

      {/* --- UNIFIED COLUMN MANAGER MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            <h2 style={{ marginTop: 0, color: '#222' }}>
              {editingIndex !== null ? 'Edit Column' : 'Add Column'}
            </h2>
            
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem', color: '#555' }}>
              <strong>Column Variables Guide:</strong>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                {cols.map((c, idx) => (
                  <div key={idx}>
                    <code style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>C{idx + 1}</code> : {c.name}
                  </div>
                ))}
              </div>
            </div>

            {formulaError && <div className="auth-error-banner">{formulaError}</div>}

            <form onSubmit={handleSaveColumn}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600' }}>Column Name</label>
              <input type="text" className="table-input" style={{ border: '1px solid #ddd', marginBottom: '15px' }} value={colName} onChange={e => setColName(e.target.value)} required />
              
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '600' }}>Column Type</label>
              <div className="role-selector" style={{ marginBottom: '15px', display: 'flex', gap: '20px', justifyContent: 'flex-start' }}>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input type="radio" name="colType" value="raw" checked={colType === 'raw'} onChange={() => setColType('raw')} /> 
                  Manual Input
                </label>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input type="radio" name="colType" value="calculated" checked={colType === 'calculated'} onChange={() => setColType('calculated')} /> 
                  Formula
                </label>
              </div>

              {colType === 'calculated' && (
                <>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: '600' }}>Formula</label>
                  <input type="text" className="table-input" style={{ border: '1px solid #ddd', marginBottom: '20px', fontFamily: 'monospace' }} placeholder="e.g., C1 * C2" value={colFormula} onChange={e => setColFormula(e.target.value)} required={colType === 'calculated'} />
                </>
              )}
              
              <button type="submit" className="auth-submit-btn">Save Column</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObservationTable;