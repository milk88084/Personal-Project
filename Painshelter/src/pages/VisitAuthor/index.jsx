import { db } from "../../utils/firebase/firebase.jsx";
import { collection, query, getDocs, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import IsLoadingPage from "@/components/IsLoadingPage.jsx";
import { AlignJustify } from "lucide-react";
import { useAuthCheck } from "@/utils/hooks/useAuthCheck.jsx";
import "react-toastify/dist/ReactToastify.css";
import IsLoading from "@/components/IsLoadingPage.jsx";
import RightSection from "./RightSection.jsx";
import LeftSectionDesk from "./LeftSectionDesk.jsx";
import LeftSectionMobile from "./LeftSectionMobile.jsx";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isMobileSize, setIsMobileSize] = useState(false);
  useAuthCheck();

  return (
    <>
      {isLoadingPage ? (
        <IsLoading />
      ) : (
        <>
          {isLoggedIn ? (
            <IsLoadingPage />
          ) : (
            <Background>
              <TopSection>
                <AlignJustify onClick={() => setIsMobileSize(true)} />
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
      )}
    </>
  );
};

export default VisitAuthor;
