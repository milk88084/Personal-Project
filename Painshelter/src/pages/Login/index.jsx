import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase/firebase.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginState } from "../../utils/zustand.js";
import logoImg from "../../assets/img/logoImg.png";
import logoTitle from "../../assets/img/logoTitle.png";
import backgroundVideo from "../../assets/video/login.mp4";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//#region
const Background = styled.div`
  height: 100vh;
`;

const BackgroundVideo = styled.video`
  width: 100%;
  height: 100vh;
  object-fit: cover;
`;

const BlackDiv = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
`;

const LogoSection = styled.div`
  position: absolute;
  top: 15%;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 25;

  img {
    width: 15%;
  }

  img:first-of-type {
    width: 7%;
  }

  @media screen and (max-width: 1279px) {
    top: 10%;
    img {
      width: 40%;
    }
    img:first-of-type {
      width: 20%;
    }
  }
`;

const MainSection = styled.div`
  position: absolute;
  top: 40%;
  left: 38%;
  z-index: 40;
  background-color: rgba(255, 255, 255, 0.8);
  width: 25%;
  height: 50%;
  border-radius: 20px;

  @media screen and (max-width: 1279px) {
    top: 30%;
    width: 300px;
    left: 0;
    right: 0;
    margin: 0 auto;
    height: 350px;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InputSection = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;

  label {
    margin-top: 30px;
  }

  input {
    outline: none;
    border: none;
    border-bottom: 1px solid #202020;
    background-color: rgba(255, 255, 255, 0);
  }
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  button {
    display: block;
    width: 100%;
    background-color: #9ca3af;
    padding: 5px;
    border-radius: 10px;
    font-weight: 400;
    margin-top: 30px;
    box-shadow: 0 10px 10px -8px rgba(0, 0, 0, 0.7);

    &:hover,
    &:focus {
      background-color: #19242b;
      color: white;
    }
  }

  button:first-of-type {
    background-color: #001a2a;
    color: white;
    &:hover,
    &:focus {
      background-color: #4c5e67;
    }
  }
`;

//#endregion

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { online, setLoginUserId, loginStatus } = useLoginState();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.3;
    }
  }, []);

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        toast.success("登入成功", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        console.log(user);
        online();
        setLoginUserId(user.uid);
        window.localStorage.setItem("userId", user.uid);
        window.localStorage.setItem("loginStatus", loginStatus);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        toast.error("密碼輸入錯誤", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  return (
    <>
      <Background>
        <LogoSection>
          <img src={logoImg} alt="logo" />
          <img src={logoTitle} alt="brandName" />
        </LogoSection>
        <BackgroundVideo
          src={backgroundVideo}
          ref={videoRef}
          loop
          autoPlay
          muted
        ></BackgroundVideo>
        <BlackDiv></BlackDiv>
        <MainSection>
          <form>
            <FormSection>
              <InputSection>
                <label htmlFor="email-address">請輸入信箱</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputSection>

              <InputSection>
                <label htmlFor="password">請輸入密碼</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputSection>

              <ButtonSection>
                <button type="button" onClick={onLogin}>
                  登入
                </button>

                <button type="button">
                  <NavLink to="/signup">註冊會員</NavLink>
                </button>
              </ButtonSection>
            </FormSection>
          </form>
        </MainSection>
        <div>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition:Bounce
          />
        </div>
      </Background>
    </>
  );
};

export default Login;
