import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: ${props => props.theme.fonts.main};
    background-color: ${props => props.theme.colors.light};
    color: ${props => props.theme.colors.primary};
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  section {
    padding: 80px 0;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
  }

  h1 {
    font-size: 48px;
    line-height: 1.1;
  }

  h2 {
    font-size: 40px;
    line-height: 1.2;
  }

  p {
    font-size: 17px;
    line-height: 1.5;
  }

  .btn {
    background-color: ${props => props.theme.colors.accent};
    color: white;
    padding: 12px 24px;
    border-radius: 980px;
    border: none;
    font-size: 17px;
    font-weight: 400;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #0077ED;
    }
  }

  .text-center {
    text-align: center;
  }

  .rtl {
    direction: rtl;
  }
`;

export default GlobalStyle;