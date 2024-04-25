import React from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
// import { Button } from "../../components/ui/button";
// import { CarouselDemo } from "../../components/Shadcn/CarouselDemo";
// import { AlertDialogDemo } from "../../components/Shadcn/AlertDialogDemo";
import { DialogDemo } from "../../components/Shadcn/DisagreeDialog";
import backgroundImg1 from "../../assets/img/disagreeImg1.jpg";
import backgroundImg4 from "../../assets/img/disagreeImg4.png";
import backgroundImg5 from "../../assets/img/disagreeImg5.png";
const Background = styled.div`
  background-color: #1a1a1a;
  background-image: url(${backgroundImg1});
  background-repeat: repeat;
  background-attachment: fixed;
  height: 100vh;
  width: 100vw;
  margin: 0;
  @media screen and (max-width: 1279px) {
    height: 100%;
  }
`;

const BlackDiv = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  background-attachment: fixed;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
`;

const MainSection = styled.div`
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 1279px) {
    display: block;
  }
`;

const haloEffect = keyframes`
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
`;

const Halo = styled.div`
  animation: ${haloEffect} 3s infinite;
  display: inline-block;
  width: 40%;
  @media screen and (max-width: 1279px) {
    width: 100%;
    margin-bottom: -50px;
  }
`;

// 創建一個StyledImage組件
const StyledImage = styled.img`
  display: block;
  @media screen and (max-width: 1279px) {
    height: 100%;
  }
`;

const Content = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 1279px) {
    width: 100%;
  }
`;

const Title = styled.div`
  width: 40%;
  opacity: 80%;
  margin-bottom: -50px;
  @media screen and (max-width: 1279px) {
    width: 300px;
    object-fit: contain;
  }
`;

const SubTitle = styled.div`
  color: white;
  width: 60%;
  @media screen and (max-width: 1279px) {
    width: 70%;
    font-weight: 100;
  }
`;

const ButtonSections = styled.div`
  display: inline-block;
`;

const Button = styled.button`
  background-color: #9ca3af;
  padding: 10px;
  border-radius: 10px;
  font-weight: 400;
  border: 1px solid white;

  &:hover,
  &:focus {
    background-color: #19242b;
    color: white;
  }
`;

export default function Disagree() {
  const navigate = useNavigate();
  return (
    <Background>
      <BlackDiv>
        <MainSection>
          <Halo>
            <StyledImage src={backgroundImg4} alt="Glowing Halo" />
          </Halo>
          <Content>
            <Title>
              <img src={backgroundImg5} alt="" />
            </Title>
            <SubTitle>
              我們無法預知每一顆星星閃爍的背後故事，也無法感受它們所經歷的努力或代價。但至少，在這廣闊的宇宙中，我們可以彼此陪伴，共同經歷這個世界的奇妙。
            </SubTitle>
            <ButtonSections>
              <DialogDemo></DialogDemo>
              <Button
                className="bg-green-400 m-6"
                onClick={() => navigate("/login")}
              >
                我同意
              </Button>
            </ButtonSections>
          </Content>
        </MainSection>
      </BlackDiv>
    </Background>
  );
}
