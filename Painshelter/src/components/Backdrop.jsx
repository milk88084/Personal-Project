import React from "react";
import { useLoginState } from "../utils/zustand";

export default function Backdrop() {
  const { modal, closeModal } = useLoginState();

  return (
    <div>
      {modal ? (
        <div
          className="w-screen h-screen fixed z-2000 bg-black top-0 left-0 opacity-80"
          onClick={closeModal}
        ></div>
      ) : null}
    </div>
  );
}
