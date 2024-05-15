import { MainModal } from "../utils/zustand";
import styled from "styled-components";
export default function Backdrop() {
  const { modal, closeModal } = MainModal();

  const Background = styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    background-color: #686868;
    top: 0;
    left: 0;
  `;

  return (
    <div>{modal ? <Background onClick={closeModal}></Background> : null}</div>
  );
}
