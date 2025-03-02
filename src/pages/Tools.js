// ... existing imports
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// ... existing styled components

// פונקציה לחישוב מסה מולקולרית - עם תמיכה משופרת באותיות קטנות
const calculateMolecularWeight = (formula) => {
  // טבלת משקלים אטומיים - עם תמיכה באותיות קטנות
  const atomicWeights = {
    'H': 1.008, 'h': 1.008,
    'He': 4.003, 'he': 4.003,
    'Li': 6.941, 'li': 6.941,
    'Be': 9.012, 'be': 9.012,
    'B': 10.811, 'b': 10.811,
    'C': 12.011, 'c': 12.011,
    'N': 14.007, 'n': 14.007,
    'O': 15.999, 'o': 15.999,
    'F': 18.998, 'f': 18.998,
    'Ne': 20.180, 'ne': 20.180,
    'Na': 22.990, 'na': 22.990,
    'Mg': 24.305, 'mg': 24.305,
    'Al': 26.982, 'al': 26.982,
    'Si': 28.086, 'si': 28.086,
    'P': 30.974, 'p': 30.974,
    'S': 32.065, 's': 32.065,
    'Cl': 35.453, 'cl': 35.453,
    'Ar': 39.948, 'ar': 39.948,
    'K': 39.098, 'k': 39.098,
    'Ca': 40.078, 'ca': 40.078,
    'Br': 79.904, 'br': 79.904,
    'I': 126.904, 'i': 126.904
  };

  // ניקוי הנוסחה מרווחים
  formula = formula.replace(/\s/g, '');
  
  // גישה פשוטה יותר - עיבוד ישיר של הנוסחה
  let totalWeight = 0;
  let i = 0;
  
  while (i < formula.length) {
    // בדיקה אם זה אות
    if (/[a-zA-Z]/.test(formula[i])) {
      let element = formula[i];
      i++;
      
      // בדיקה אם האות הבאה היא אות קטנה (אלמנט דו-אותי)
      if (i < formula.length && /[a-z]/.test(formula[i])) {
        element += formula[i];
        i++;
      }
      
      // חיפוש מספר (כמות)
      let countStr = '';
      while (i < formula.length && /\d/.test(formula[i])) {
        countStr += formula[i];
        i++;
      }
      
      const count = countStr === '' ? 1 : parseInt(countStr, 10);
      
      // בדיקה אם האלמנט קיים בטבלה
      if (atomicWeights[element] === undefined) {
        return `שגיאה: האלמנט ${element} לא נמצא בטבלה`;
      }
      
      totalWeight += atomicWeights[element] * count;
    } else {
      // אם זה לא אות, נתקדם
      i++;
    }
  }
  
  return totalWeight.toFixed(3);
};

// מאגר משוואות מאוזנות נפוצות
const commonEquations = {
  'h2+o2=h2o': '2H2 + O2 = 2H2O',
  'ch4+o2=co2+h2o': 'CH4 + 2O2 = CO2 + 2H2O',
  'c+o2=co2': 'C + O2 = CO2',
  'h2+cl2=hcl': 'H2 + Cl2 = 2HCl',
  'na+cl2=nacl': '2Na + Cl2 = 2NaCl',
  'c3h8+o2=co2+h2o': 'C3H8 + 5O2 = 3CO2 + 4H2O',
  'fe+o2=fe2o3': '4Fe + 3O2 = 2Fe2O3',
  'n2+h2=nh3': 'N2 + 3H2 = 2NH3'
};

// פונקציה משופרת לאיזון משוואות כימיות
const balanceChemicalEquation = (equation) => {
  // ניקוי המשוואה מרווחים
  equation = equation.replace(/\s/g, '');
  
  // בדיקה שהמשוואה תקינה
  if (!equation.includes('=')) {
    return 'שגיאה: המשוואה חייבת לכלול סימן שווה (=)';
  }
  
  // בדיקה אם המשוואה נמצאת במאגר (בגרסה עם אותיות קטנות)
  const normalizedEquation = equation.toLowerCase().replace(/\s+/g, '');
  
  for (const key in commonEquations) {
    if (key === normalizedEquation) {
      return `המשוואה המאוזנת: ${commonEquations[key]}`;
    }
  }
  
  // אם המשוואה לא נמצאה במאגר, החזר הודעה מתאימה
  return 'המשוואה לא נמצאה במאגר. נסה אחת מהמשוואות הבאות: H2+O2=H2O, CH4+O2=CO2+H2O';
};