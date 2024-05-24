import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import RightSection from "./RightSection.jsx";
import IsLoadingPage from "@/components/IsLoadingPage.jsx";
import LeftSectionDesk from "./LeftSectionDesk.jsx";
import LeftSectionMobile from "./LeftSectionMobile.jsx";
import { useState } from "react";
import { AlignJustify } from "lucide-react";
import { useAuthCheck } from "@/utils/hooks/useAuthCheck.jsx";
import { ToastContainer } from "react-toastify";

//#region
const Background = styled.div`
  color: white;
  position: relative;
  font-family: "Noto Sans TC", sans-serif;
  height: 100vh;
  background-color: #29292d;
`;

const TopSection = styled.div`
  display: none;
  @media screen and (max-width: 1279px) {
    display: flex;
    align-items: center;
    position: fixed;
    top: 0;
    height: 40px;
    z-index: 200;
    width: 100%;
    background-color: #353535;
  }
`;
const ShowLeftSection = styled.div``;

//#endregion

const VisitAuthor = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileSize, setIsMobileSize] = useState(false);
  useAuthCheck();
  setTimeout(() => setIsLoading(false), 1000);

  return (
    <>
      {isLoading ? (
        <IsLoadingPage />
      ) : (
        <Background>
          <TopSection>
            <AlignJustify
              style={{ cursor: "pointer" }}
              onClick={() => setIsMobileSize(true)}
            />
          </TopSection>
          {isMobileSize ? (
            <ShowLeftSection>
              <LeftSectionMobile setIsMobileSize={setIsMobileSize} />
            </ShowLeftSection>
          ) : null}
          <LeftSectionDesk />
          <RightSection />
        </Background>
      )}
    </>
  );
};
<ToastContainer />;

export default VisitAuthor;
