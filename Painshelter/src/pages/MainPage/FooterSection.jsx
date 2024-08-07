import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";

import logoImg from "@/assets/img/logoImg.png";
import footer1 from "@/assets/img/mainFooter1.jpg";
import { AccordionDemo } from "@/components/Shadcn/Accordion";
import { auth } from "@/utils/firebase/firebase.jsx";
import { toastAlert } from "@/utils/toast.js";
import { useLoginState } from "@/utils/zustand.js";

//#region
const FooterSectionWrapper = styled.div`
  display: flex;
  width: 100%;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
  }
`;

const FooterImg = styled.div`
  width: 1000px;
  @media screen and (max-width: 1279px) {
    width: 100%;
    img {
      width: 100%;
    }
  }
`;

const FooterContent = styled.div`
  margin-top: 50px;
  width: 100%;
  color: white;
  font-size: 40px;
  letter-spacing: 5px;

  div {
    line-height: 30px;
  }

  button {
    color: #fffed6;
    opacity: 80%;
    font-size: 40px;
    letter-spacing: 5px;
    padding-top: 30px;
    font-weight: 600;
  }

  span {
    color: black;
    background-color: #fff0ac;
    border-radius: 6px;
    cursor: pointer;
    padding: 3px 12px;
    margin-top: 20px;
  }

  span:hover {
    background-color: #ffbb28;
    transform: scale(0.9);
    text-shadow: 1px 1px 20px white;
  }

  span:active {
    transform: scale(0.8);
  }

  img {
    position: fixed;
    width: 100px;
    padding: 10px;
    right: 0;
    bottom: 0;
    margin: 0px 10px 12px 0px;
    opacity: 0.4;
    cursor: pointer;
  }

  img:hover {
    transform: scale(1.2);
    opacity: 1;
  }

  @media screen and (max-width: 1279px) {
    margin-top: 30px;
    font-size: 20px;
    letter-spacing: 3px;
    padding: 10px;
    button {
      font-size: 40px;
      letter-spacing: 4px;
    }
    img {
      display: none;
    }
  }
`;
//#endregion

export default function FooterSection({ footer }) {
  const navigate = useNavigate();
  const { offline, logout } = useLoginState();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        toastAlert("success", "成功登出", 2000);
        window.localStorage.removeItem("userId");
        window.localStorage.removeItem("loginStatus");
      })
      .catch((e) => {
        toastAlert("error", e, 2000);
      });
    offline();
    logout();
    scrollSection(top);
  };

  const scrollSection = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <FooterSectionWrapper>
      <FooterImg>
        <img src={footer1} alt="footer img" />
      </FooterImg>
      <FooterContent ref={footer}>
        <AccordionDemo></AccordionDemo>
        <button onClick={handleLogout}>登出</button>
        <img onClick={scrollSection} src={logoImg} alt={logoImg} />
      </FooterContent>
      <ToastContainer />
    </FooterSectionWrapper>
  );
}
