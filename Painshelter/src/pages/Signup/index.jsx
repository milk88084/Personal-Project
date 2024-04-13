import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../utils/firebase/firebase.jsx";
import { setDoc, doc } from "firebase/firestore";
import { useFormInput } from "../../utils/hooks/useFormInput.jsx";

const Signup = () => {
  const navigate = useNavigate();
  const emailInput = useFormInput();
  const passwordInput = useFormInput();
  const nameInput = useFormInput();

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
                  {...nameInput}
                  value={nameInput.value}
                  onChange={nameInput.onChange}
                  required
                  placeholder="請輸入註冊者姓名"
                  className=" border-2 border-black"
                />
              </div>

              <p></p>

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
                  {...emailInput}
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
                  type="{password}"
                  label="Create password"
                  {...passwordInput}
                  required
                  placeholder="Password"
                  className=" border-2 border-black "
                />
              </div>

              {passwordInput.value.length < 6 ? <p>請輸入6位數以上密碼</p> : ""}

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
