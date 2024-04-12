import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase/firebase.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { loginState } from "../../utils/zustand.js";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { online, setLoginUserId } = loginState();

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
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <>
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
