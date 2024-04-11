import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../utils/firebase/firebase.jsx";

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        updateProfile(user, {
          displayName: name,
        }).then(() => {
          console.log(user);

          console.log(name);
          navigate("/login");
          // ...
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
  };

  return (
    <main>
      <section>
        <div>
          <div>
            <h1> 註冊會員 </h1>
            <form onSubmit={onSubmit}>
              <div className="mt-5">
                <label htmlFor="name" className="block w-32 bg-blue-600 ">
                  輸入姓名
                </label>
                <input
                  type="text"
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="王曉明"
                  className=" border-2 border-black"
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="email-address"
                  className="block w-32 bg-blue-600 "
                >
                  Email address
                </label>
                <input
                  type="email"
                  label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email address"
                  className=" border-2 border-black"
                />
              </div>

              <div className="mt-5">
                <label htmlFor="password" className="block w-32 bg-blue-600 ">
                  Password
                </label>
                <input
                  type="password"
                  label="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className=" border-2 border-black "
                />
              </div>

              <button type="submit" className="mt-5 border-2 border-black">
                註冊
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Signup;
