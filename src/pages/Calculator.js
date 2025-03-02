import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCalculator, FaFlask, FaBalanceScale, FaAtom } from 'react-icons/fa';

const CalculatorContainer = styled.div`
  padding: 100px 20px 50px;
  max-width: 1200px;
  margin: 0 auto;
  direction: rtl;
`;

const PageTitle = styled(motion.h1)`
  font-size: 48px;
  margin-bottom: 20px;
  text-align: center;
  color: ${props => props.theme.colors.primary};
`;

const PageSubtitle = styled(motion.p)`
  font-size: 18px;
  margin-bottom: 50px;
  text-align: center;
  color: ${props => props.theme.colors.gray};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const CalculatorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CalculatorCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  
  svg {
    font-size: 24px;
    color: ${props => props.theme.colors.accent};
  }
  
  h2 {
    font-size: 24px;
    color: ${props => props.theme.colors.primary};
    margin: 0;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  input, select {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
  }
`;

const CalculateButton = styled.button`
  background-color: ${props => props.theme.colors.accent};
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
  
  &:hover {
    background-color: #0077ED;
  }
`;

const ResultBox = styled.div`
  background-color: ${props => props.theme.colors.light};
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  
  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    margin: 5px 0;
    font-size: 16px;
  }
  
  .result-value {
    font-weight: bold;
    color: ${props => props.theme.colors.accent};
  }
`;

// Atomic weights for common elements in organic chemistry
const atomicWeights = {
  // Single letter elements
  'H': 1.008, 'h': 1.008,
  'C': 12.011, 'c': 12.011,
  'N': 14.007, 'n': 14.007,
  'O': 15.999, 'o': 15.999,
  'F': 18.998, 'f': 18.998,
  'P': 30.974, 'p': 30.974,
  'S': 32.065, 's': 32.065,
  'B': 10.811, 'b': 10.811,
  'K': 39.098, 'k': 39.098,
  'I': 126.904, 'i': 126.904,
  
  // Two letter elements
  'He': 4.003, 'HE': 4.003, 'he': 4.003,
  'Li': 6.941, 'LI': 6.941, 'li': 6.941,
  'Be': 9.012, 'BE': 9.012, 'be': 9.012,
  'Ne': 20.180, 'NE': 20.180, 'ne': 20.180,
  'Na': 22.990, 'NA': 22.990, 'na': 22.990,
  'Mg': 24.305, 'MG': 24.305, 'mg': 24.305,
  'Al': 26.982, 'AL': 26.982, 'al': 26.982,
  'Si': 28.086, 'SI': 28.086, 'si': 28.086,
  'Cl': 35.453, 'CL': 35.453, 'cl': 35.453,
  'Ar': 39.948, 'AR': 39.948, 'ar': 39.948,
  'Ca': 40.078, 'CA': 40.078, 'ca': 40.078,
  'Br': 79.904, 'BR': 79.904, 'br': 79.904
};

// Remove this duplicate function that's outside the component
// const calculateMolecularWeight = () => { ... }; 

const Calculator = () => {
  const [formula, setFormula] = useState('');
  const [molecularWeight, setMolecularWeight] = useState(null);
  
  const [reaction, setReaction] = useState('');
  const [balancedReaction, setBalancedReaction] = useState('');
  
  // Keep only this function inside the component
  const calculateMolecularWeight = () => {
    let weight = 0;
    
    // Clean up the formula and convert to a standard format
    const cleanFormula = formula.trim().replace(/\s/g, '');
    
    // Process the formula character by character
    let i = 0;
    while (i < cleanFormula.length) {
      // Get the current character
      let currentChar = cleanFormula[i];
      i++;
      
      // Try to identify the element (could be one or two characters)
      let element = currentChar;
      
      // Check if this could be a two-letter element
      if (i < cleanFormula.length && /[a-zA-Z]/.test(cleanFormula[i])) {
        // Try the two-letter version first
        const twoLetterElement = currentChar + cleanFormula[i];
        
        // Check if this two-letter element exists in our table
        if (atomicWeights[twoLetterElement] !== undefined) {
          element = twoLetterElement;
          i++; // Move past the second letter
        }
      }
      
      // Get the count (number of atoms)
      let countStr = '';
      while (i < cleanFormula.length && /\d/.test(cleanFormula[i])) {
        countStr += cleanFormula[i];
        i++;
      }
      
      const count = countStr ? parseInt(countStr) : 1;
      
      // Check if the element exists in our table
      if (atomicWeights[element] === undefined) {
        setMolecularWeight(`שגיאה: האלמנט ${element} לא נמצא בטבלה`);
        return;
      }
      
      weight += atomicWeights[element] * count;
    }
    
    setMolecularWeight(weight.toFixed(3));
  };
  
  // Placeholder for balancing chemical equations
  const balanceEquation = () => {
    // In a real app, this would implement a proper equation balancing algorithm
    setBalancedReaction("2H₂ + O₂ → 2H₂O");
  };
  
  return (
    <CalculatorContainer>
      <PageTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        מחשבון מולקולרי
      </PageTitle>
      
      <PageSubtitle
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        כלים שימושיים לחישובים בכימיה אורגנית. חשב משקל מולקולרי, איזן משוואות כימיות ועוד.
      </PageSubtitle>
      
      <CalculatorGrid>
        <CalculatorCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardHeader>
            <FaCalculator />
            <h2>חישוב משקל מולקולרי</h2>
          </CardHeader>
          
          <InputGroup>
            <label>נוסחה מולקולרית:</label>
            <input 
              type="text" 
              placeholder="לדוגמה: C6H12O6" 
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
            />
            <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              הזן נוסחה מולקולרית כמו C6H12O6 (גלוקוז) או CH3COOH (חומצה אצטית)
            </p>
          </InputGroup>
          
          <CalculateButton onClick={calculateMolecularWeight}>
            חשב משקל מולקולרי
          </CalculateButton>
          
          {molecularWeight && (
            <ResultBox>
              <h3>תוצאה:</h3>
              <p>המשקל המולקולרי של <strong>{formula}</strong> הוא: <span className="result-value">{molecularWeight} g/mol</span></p>
            </ResultBox>
          )}
        </CalculatorCard>
        
        <CalculatorCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardHeader>
            <FaBalanceScale />
            <h2>איזון משוואות כימיות</h2>
          </CardHeader>
          
          <InputGroup>
            <label>משוואה כימית:</label>
            <input 
              type="text" 
              placeholder="לדוגמה: H2 + O2 -> H2O" 
              value={reaction}
              onChange={(e) => setReaction(e.target.value)}
            />
            <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              הזן משוואה כימית עם חץ (-) בין המגיבים לתוצרים
            </p>
          </InputGroup>
          
          <CalculateButton onClick={balanceEquation}>
            אזן משוואה
          </CalculateButton>
          
          {balancedReaction && (
            <ResultBox>
              <h3>משוואה מאוזנת:</h3>
              <p className="result-value">{balancedReaction}</p>
            </ResultBox>
          )}
        </CalculatorCard>
      </CalculatorGrid>
    </CalculatorContainer>
  );
};

export default Calculator;