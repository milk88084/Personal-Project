import BackdropHistory from "./BackdropHHistory";
import { HistoryModal } from "../utils/zustand.js";
import poem from "../utils/data/poem.json";
import modalpoem from "../assets/img/modalpoem.jpg";
import styled from "styled-components";

const Background = styled.div`
  background-image: url(${modalpoem});
  width: 50%;
  height: 58%;
  position: fixed;
  display: flex;
  padding: 30px;
  flex-direction: column;
  box-shadow: 1px 1px 30px 15px #ffd4f4;
  opacity: 0.8;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto auto;
  border-radius: 15px;
  h1 {
    font-size: 50px;
    font-weight: 600;
    color: #363b44;
  }

  h2 {
    margin-top: 7px;
    font-size: 20px;
    font-weight: 400;
  }

  p {
    font-size: 15px;
    margin-top: 5px;
  }

  button {
    background-color: #9ca3af;
    padding: 10px;
    border-radius: 10px;
    font-weight: 400;
    border: 1px solid white;
    margin: 24px;

    &:hover,
    &:focus {
      background-color: #19242b;
      color: white;
    }
  }

  @media screen and (max-width: 1279px) {
    width: 70%;
    height: 80%;
    padding: 15px;
    border-radius: 12px;
    h1 {
      font-size: 25px;
    }

    h2 {
      margin-top: 5px;
      font-size: 14px;
    }

    p {
      font-size: 12px;
      margin-top: 10px;
    }

    button {
      padding: 7px;
      border-radius: 10px;
      margin: 20px;
    }
  }
`;

export default function Modal() {
  const { modal, closeModal } = HistoryModal();
  const poemData = poem;
  const rand = Math.floor(Math.random() * poemData.length);
  const randPoem = poemData[rand];
  return (
    <div>
      <BackdropHistory />
      {modal ? (
        <Background>
          <h1>{'"來自一封信"'}</h1>
          <h2>疼痛暗號：{randPoem.title}</h2>
          <p>{randPoem.content}</p>
          <button
            onClick={() => {
              closeModal();
            }}
          >
            確認
          </button>
        </Background>
      ) : null}
    </div>
  );
}
