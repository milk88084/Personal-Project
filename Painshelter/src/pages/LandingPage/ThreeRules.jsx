import styled from "styled-components";
import logoImg from "../../assets/img/logoImg.png";
import logoTitle from "../../assets/img/logoTitle3.png";
import backgroundImg1 from "../../assets/img/disagreeImg1.jpg";
import { CarouselDemo } from "../../components/Shadcn/CarouselDemo";

//#region
const ModalBackground = styled.div`
  background-image: url(${backgroundImg1});
  position: absolute;
  z-index: 1001;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const Opacity = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const Modal = styled.div`
  width: 80%;
  height: 600px;
  background-color: rgba(255, 255, 255, 0.5);
  top: 50px;
  position: absolute;
  display: flex;
  align-items: center;
  border-radius: 30px;
  justify-content: space-around;
  @media screen and (max-width: 1279px) {
    display: block;
    height: 850px;
  }
`;

const ModalLogo = styled.div`
  img {
    width: 250px;
  }

  img:hover {
    transform: scale(1.1);
  }
  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    img {
      width: 150px;
    }
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    font-size: 50px;
    margin-bottom: 30px;
    font-weight: bold;
    letter-spacing: 10px;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 1px 2px 5px black;
  }
  @media screen and (max-width: 1279px) {
    h1 {
      font-size: 30px;
      margin-top: 30px;
    }
    span {
      right: 0;
      left: 0;
      margin: 0 auto;
    }
  }
`;

const ModalButton = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  button {
    display: block;
    width: 150px;
    background-color: #001a2a;
    color: white;
    padding: 10px;
    border-radius: 10px;
    font-weight: 400;
    margin-top: 15px;
    box-shadow: 0 10px 10px -8px rgba(0, 0, 0, 0.7);
    margin: 15px;

    &:hover,
    &:focus {
      background-color: #4c5e67;
    }
  }
  @media screen and (max-width: 1279px) {
    flex-direction: column;
  }
`;
//#endregion
export default function ThreeRules({ setThreeRules }) {
  return (
    <ModalBackground>
      <Opacity>
        <Modal>
          <ModalLogo>
            <img src={logoImg} alt="Logo" />
            <img src={logoTitle} alt="Logo title" />
          </ModalLogo>
          <ModalContent>
            <h1>溫柔宣言</h1>
            <span>
              <CarouselDemo></CarouselDemo>
            </span>
            <ModalButton>
              <button onClick={() => setThreeRules(false)}>同意</button>
            </ModalButton>
          </ModalContent>
        </Modal>
      </Opacity>
    </ModalBackground>
  );
}
