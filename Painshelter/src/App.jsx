import { createGlobalStyle } from "styled-components";
import MainPage from "@/pages/MainPage/index.jsx";

//#region
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    font-family: 'Noto Sans TC', sans-serif;
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
