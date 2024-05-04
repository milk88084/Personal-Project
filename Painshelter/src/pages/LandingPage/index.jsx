import { useEffect, useRef } from "react";
import styled from "styled-components";
import logo from "../../assets/svg/logoTitle3.svg";
import { gsap } from "gsap";

const TopSection = styled.div`
  video {
    width: 100%;
    height: 100vh;
    object-fit: cover;
  }
`;

export default function LandingPage() {
  const topSectionRef = useRef(null);

  useEffect(() => {
    // 確保元素已經掛載到 DOM
    if (topSectionRef.current) {
      gsap.fromTo(
        topSectionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2, ease: "none" }
      );
    }
  }, []);

  return (
    <div>
      <TopSection ref={topSectionRef}>
        <img src={logo} alt="Logo" />
        {/* 假設你有一個 video 變量 */}
        {/* <video src={video} loop height="480px" autoPlay muted></video> */}
      </TopSection>
    </div>
  );
}
