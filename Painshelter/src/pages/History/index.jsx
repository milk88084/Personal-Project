import styled from "styled-components";
import ModalHistory from "@/components/ModalHistory.jsx";
import IsLoadingPage from "@/components/IsLoadingPage.jsx";
import RightCategories from "./RightCategories.jsx";
import LeftSectionMobile from "./LeftSectionMobile.jsx";
import LeftSectionDesktop from "./LeftSectionDesktop .jsx";
import RightHistoryPosts from "./RightHistoryPosts.jsx";
import { useLocation } from "react-router-dom";
import { HistoryModal } from "@/utils/zustand.js";
import { AlignJustify } from "lucide-react";
import { useAuthCheck } from "@/utils/hooks/useAuthCheck.jsx";
import { useState, useEffect, useRef } from "react";

//#region
const Background = styled.div`
  color: white;
  position: relative;
  font-family: "Noto Sans TC", sans-serif;
  height: 100%;
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

const RightSection = styled.div`
  width: calc(100vw - 330px);
  position: absolute;
  right: 0;
  background: #29292d;
  background-size: 400% 400%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 1279px) {
    width: 100%;
    margin-top: 30px;
    position: relative;
  }
`;

const SpanSection = styled.div`
  width: 100%;
`;

//#endregion

export default function History() {
  const { modal } = HistoryModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSize, setIsMobileSize] = useState(false);
  const storyRef = useRef(null);
  const location = useLocation();
  useAuthCheck();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div>
      {isLoading ? (
        <IsLoadingPage />
      ) : (
        <>
          <Background>
            <TopSection>
              <AlignJustify onClick={() => setIsMobileSize(true)} />
            </TopSection>
            {isMobileSize ? (
              <ShowLeftSection>
                <LeftSectionMobile
                  isMobileSize={isMobileSize}
                  setIsMobileSize={setIsMobileSize}
                />
              </ShowLeftSection>
            ) : null}
            <LeftSectionDesktop />
            <RightSection>
              <RightCategories storyRef={storyRef} />
              <SpanSection ref={storyRef}>
                <RightHistoryPosts setIsLoading={setIsLoading} />
              </SpanSection>
            </RightSection>
          </Background>
          {modal ? <ModalHistory /> : null}
        </>
      )}
    </div>
  );
}
