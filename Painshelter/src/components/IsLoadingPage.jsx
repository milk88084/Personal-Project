import styled from "styled-components";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { bouncy } from "ldrs";
import logo from "@/assets/img/logoImg.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
  color: #fff;
  position: relative;
  img {
    width: 120px;
    margin-bottom: 35px;
  }
`;

export default function IsLoadingPage() {
  bouncy.register();
  const logoRef = useRef(null);
  useEffect(() => {
    gsap.to(logoRef.current, {
      duration: 3,
      rotation: 360,
      scale: 1.2,
      ease: "power4.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return (
    <Container>
      <img ref={logoRef} src={logo} alt={logo} />
      <l-bouncy size="60" speed="1.75" color="white"></l-bouncy>
    </Container>
  );
}
