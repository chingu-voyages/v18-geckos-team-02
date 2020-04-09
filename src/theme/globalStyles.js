import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
}
`;
export default GlobalStyle;

export const theme = {
  red: "#FC5F6B",
  blue: "#5887F9",
  veryDarkBlue: "#4C5264",
  lightBlue: "#60C3FF",
  blueGradient: "#5574f7-#60C3FF",
  grey: "#BCC5D3",
  lightGrey: "#E2E8ED",
  white: "#FFFFFF",
  offWhite: "#F6F6F6"
}