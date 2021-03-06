import { createGlobalStyle } from 'styled-components';

export const theme = {
  red: "#FC5F6B",
  blue: "#12A7EA",
  darkBlue: "#1B71D5",
  veryDarkBlue: "#1B71D5",
  greyBlue: "#AEC1D5",
  lightBlue: "#D6F3FF",
  blueGradient: "#5574f7-#60C3FF",
  grey: "#BCC5D3",
  lightGrey: "#E2E8ED",
  darkGrey: "#707070",
  white: "#FFFFFF",
  offWhite: "#F6F6F6",
  orange: "#EA9713",
  green:"#58ED15",
  greyBlueTransp: "rgba(174,193,213,0.75)",
  darkBlueTransp: "rgba(27,113,213,0.6)"
}

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
  color: ${theme.orange};
}

header {
  color: ${theme.orange};
}
`;

export default GlobalStyle;

