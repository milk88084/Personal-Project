import { HistoryModal } from "../utils/zustand";
import styled from "styled-components";
export default function Backdrop() {
  const { modal, closeModal } = HistoryModal();

  const Background = styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: pink;
    top: 0;
    left: 0;
    opacity: 0.9;
  `;

  return (
    <div>{modal ? <Background onClick={closeModal}></Background> : null}</div>
  );
}
