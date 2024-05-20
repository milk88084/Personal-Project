import styled from "styled-components";
import logoImg from "../../assets/img/logoImg2.png";
import logoTitle from "../../assets/img/logoTitle2.png";
import backgroundVideo from "../../assets/video/login.mp4";
import { auth, db } from "../../utils/firebase/firebase.jsx";
import { toastAlert } from "@/utils/toast.js";
import { useNavigate } from "react-router-dom";
import { useFormInput } from "../../utils/hooks/useFormInput.jsx";
import { ToastContainer } from "react-toastify";
import { useRef, useEffect } from "react";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

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
  background-color: rgba(255, 255, 255, 0.9);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
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
  height: 450px;
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
    margin-top: 15px;
    box-shadow: 0 10px 10px -8px rgba(0, 0, 0, 0.7);

    &:hover {
      background-color: #9ca3af;
      color: #19242b;
    }
    &:active {
      box-shadow: 2px 2px 5px #666666;
      transform: scale(0.9);
    }
  }
  @media screen and (max-width: 1279px) {
    margin-top: 20px;
  }
`;

const Alert = styled.div`
  margin-top: 10px;
  color: #9e1818;
  font-size: 15px;
`;
//#endregion

const Signup = () => {
  const navigate = useNavigate();
  const emailInput = useFormInput();
  const passwordInput = useFormInput();
  const nameInput = useFormInput();
  const videoRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    )
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(user, {
          displayName: nameInput.value,
        }).then(() => {
          alert(user);
          toastAlert("success", "註冊成功，請至登入頁面進行登入", 1000);
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/email-already-in-use") {
          toastAlert("error", "此信箱已註冊", 2000);
        } else {
          toastAlert("error", "註冊不成功", 2000);
        }
        alert(errorCode, errorMessage);
      });

    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        id: auth.currentUser.uid,
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        Registration: Timestamp.fromDate(new Date()),
      });
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.3;
    }
  }, []);

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
            <form onSubmit={onSubmit}>
              <FormSection>
                <InputSection>
                  <label htmlFor="name">輸入姓名</label>
                  <input
                    type="text"
                    label="Name"
                    value={nameInput.value}
                    onChange={nameInput.onChange}
                    required
                    placeholder="王柏傑"
                    className=" border-2 border-black"
                    maxLength="10"
                  />
                </InputSection>
                <InputSection>
                  <label htmlFor="email-address">輸入信箱</label>
                  <input
                    type="email"
                    label="Email address"
                    {...emailInput}
                    required
                    placeholder="example@gmail.com"
                  />
                </InputSection>
                <InputSection>
                  <label htmlFor="password">輸入密碼</label>
                  <input
                    type="password"
                    label="Create password"
                    {...passwordInput}
                    required
                    placeholder="Password"
                  />
                </InputSection>
                {passwordInput.value.length < 6 ? (
                  <Alert>請輸入6位數以上密碼</Alert>
                ) : (
                  ""
                )}
                <ButtonSection>
                  <button type="submit">註冊</button>
                  <p onClick={() => navigate("/login")}>登入</p>
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

export default Signup;
