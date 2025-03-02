import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  a {
    text-decoration: none;
    color: inherit;
  }
  
  a:visited {
    color: inherit;
  }
  
  button {
    cursor: pointer;
  }
`;

export default GlobalStyles;