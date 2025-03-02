import React from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(10px, -10px) rotate(90deg); }
  50% { transform: translate(0, -20px) rotate(180deg); }
  75% { transform: translate(-10px, -10px) rotate(270deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
`;

const MoleculeWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
`;

const Molecule = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border: 2px solid rgba(144, 202, 249, 0.5);
  border-radius: 50%;
  animation: ${float} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 60%;
    height: 60%;
    border: 2px solid rgba(144, 202, 249, 0.3);
    border-radius: 50%;
  }
  
  &::before {
    top: 20%;
    left: 20%;
    transform: rotate(45deg);
  }
  
  &::after {
    bottom: 20%;
    right: 20%;
    transform: rotate(-45deg);
  }
`;

const Molecules = () => {
  // Create 15 random molecules
  const molecules = Array(15).fill().map((_, i) => ({
    size: Math.random() * 40 + 20,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
    top: Math.random() * 100,
    left: Math.random() * 100,
  }));

  return (
    <MoleculeWrapper>
      {molecules.map((molecule, i) => (
        <Molecule key={i} {...molecule} />
      ))}
    </MoleculeWrapper>
  );
};

export default Molecules;