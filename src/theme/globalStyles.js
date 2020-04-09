import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

body {
  font-family: 'Lato', sans-serif;
  font-size: 16px;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Proza Libre', sans-serif;
  font-weight: 600;
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