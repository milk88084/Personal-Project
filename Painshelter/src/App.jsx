import { createGlobalStyle } from "styled-components";

import MainPage from "@/pages/MainPage/index.jsx";

//#region
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <MainPage />
    </>
  );
}

export default App;
