import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../utils/firebase/firebase.jsx";
import { setDoc, doc } from "firebase/firestore";
import { useFormInput } from "../../utils/hooks/useFormInput.jsx";
import logoImg from "../../assets/img/logoImg2.png";
import logoTitle from "../../assets/img/logoTitle2.png";
import backgroundVideo from "../../assets/video/login.mp4";
import { useRef, useEffect } from "react";

const Background = styled.div`
  height: 100vh;
`;

const BackgroundVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BlackDiv = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
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
    background-color: #001a2a;
    color: white;
    padding: 5px;
    border-radius: 10px;
    font-weight: 400;
    margin-top: 15px;
    box-shadow: 0 10px 10px -8px rgba(0, 0, 0, 0.7);

    &:hover,
    &:focus {
      background-color: #4c5e67;
    }
  }
`;

const Alert = styled.div`
  margin-top: 10px;
  color: #9e1818;
  font-size: 15px;
`;

const Signup = () => {
  const navigate = useNavigate();
  const emailInput = useFormInput();
  const passwordInput = useFormInput();
  const nameInput = useFormInput();
  const videoRef = useRef(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    //Official registration member code
    await createUserWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    )
      .then((userCredential) => {
        const user = userCredential.user;

        //The method needed to add a name during this test.
        updateProfile(user, {
          displayName: nameInput.value,
        }).then(() => {
          console.log(user);
          alert("註冊成功，請至登入頁面進行登入");
          navigate("/login");
          // ...
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

    //Store the registered member's information in Firestore.
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        id: auth.currentUser.uid,
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
      });
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  //監聽背景圖片
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.3;
    }
  }, []);

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
          <form onSubmit={onSubmit}>
            <FormSection>
              <InputSection>
                <label htmlFor="name">輸入姓名</label>
                <input
                  type="text"
                  label="Name"
                  {...nameInput}
                  value={nameInput.value}
                  onChange={nameInput.onChange}
                  required
                  placeholder="王柏傑"
                  className=" border-2 border-black"
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
                  type="{password}"
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
              </ButtonSection>
            </FormSection>
          </form>
        </MainSection>
      </Background>
    </>
  );
};

export default Signup;
