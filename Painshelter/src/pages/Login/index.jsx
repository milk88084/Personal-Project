import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase/firebase.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginState } from "../../utils/zustand.js";
import logoImg from "../../assets/img/logoImg.png";
import logoTitle from "../../assets/img/logoTitle.png";
import backgroundVideo from "../../assets/video/login.mp4";

const Background = styled.video``;

const BlackDiv = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  background-attachment: fixed;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
`;

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
        navigate("/");
        console.log(user);
        online();
        setLoginUserId(user.uid);
        window.localStorage.setItem("userId", user.uid);
        window.localStorage.setItem("loginStatus", loginStatus);
        alert("登入成功");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        alert("登入失敗，重確認信箱或密碼是否正確");
      });
  };

  return (
    <>
      <Background ref={videoRef} src={backgroundVideo} loop autoPlay muted>
        <BlackDiv></BlackDiv>
      </Background>
      <main>
        <section>
          <div>
            <p> 登入頁面 </p>

            <form>
              <div className="mt-5">
                <label
                  htmlFor="email-address"
                  className="block w-32 bg-blue-600 "
                >
                  請輸入信箱
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  className=" border-2 border-black "
                />
              </div>

              <div className="mt-5">
                <label htmlFor="password" className="block w-32 bg-blue-600 ">
                  請輸入密碼
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className=" border-2 border-black "
                />
              </div>

              <div className="mt-5">
                <button
                  className="mt-5 border-2 border-black"
                  onClick={onLogin}
                >
                  登入
                </button>
                <p className="text-smtext-center">
                  尚未註冊? <NavLink to="/signup">註冊會員</NavLink>
                </p>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;
