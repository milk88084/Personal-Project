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
  font-family: "Noto Sans TC", sans-serif;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BackgroundVideo = styled.video`
  width: 100%;
  height: 100vh;
  object-fit: cover;
  pointer-events: none;
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

const MainSection = styled.div`
  position: absolute;
  top: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 80px;

  span:nth-child(1) {
    display: flex;
    margin-bottom: 30px;
  }

  img {
    height: 100px;
    cursor: pointer;
  }

  @media screen and (max-width: 1279px) {
    margin-top: 20px;

    span:nth-child(1) {
      display: flex;
      margin-bottom: 30px;
    }

    img {
      height: 80px;
      cursor: pointer;
    }
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  width: 400px;
  height: 350px;
  @media screen and (max-width: 1279px) {
    height: 400px;
  }
`;

const InputSection = styled.div`
  width: 300px;
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
    padding: 4px;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60%;
  margin-top: 45px;

  p {
    margin-top: 10px;
    text-decoration: underline;
    cursor: pointer;
    opacity: 0.6;
  }

  button {
    display: block;
    width: 100%;
    background-color: #19242b;
    color: white;
    padding: 5px;
    border-radius: 10px;
    font-weight: 400;
    margin-bottom: 10px;
    box-shadow: 0 10px 10px -8px rgba(0, 0, 0, 0.7);
  }

  button:hover {
    background-color: #9ca3af;
    color: #19242b;
  }

  button:active {
    box-shadow: 2px 2px 5px #666666;
    transform: scale(0.9);
  }

  p {
    text-decoration: underline;
    cursor: pointer;
    opacity: 0.6;
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

  console.log(loginStatus);
  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        online();
        const user = userCredential.user;
        toast.success("登入成功", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setLoginUserId(user.uid);
        window.localStorage.setItem("userId", user.uid);
        window.localStorage.setItem("loginStatus", true);
        setTimeout(() => {
          navigate("/main");
        }, 1000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/invalid-credential") {
          toast.error("密碼錯誤", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else if (errorCode === "auth/missing-password") {
          toast.error("未填寫密碼", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else if (errorCode === "auth/invalid-email") {
          toast.error("尚未輸入信箱/信箱填寫錯誤", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.error("登入發生錯誤", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <>
      <Background>
        <BackgroundVideo
          src={backgroundVideo}
          ref={videoRef}
          loop
          autoPlay
          muted
        ></BackgroundVideo>
        <BlackDiv></BlackDiv>

        <MainSection>
          <span>
            <img onClick={() => navigate("/")} src={logoImg} alt="logo" />
            <img
              onClick={() => navigate("/")}
              src={logoTitle}
              alt="brandName"
            />
          </span>
          <span>
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
                  <button type="submit" onClick={onLogin}>
                    登入
                  </button>
                  <p>
                    <NavLink to="/signup">註冊</NavLink>
                  </p>
                </ButtonSection>
              </FormSection>
            </form>
          </span>
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
