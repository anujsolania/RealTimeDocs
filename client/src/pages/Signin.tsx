import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/user-service";
import { useStore } from "../store/zustand";

function Signin() {
  const navigate = useNavigate();

  const setAuth = useStore((state) => state.setAuth);

  const [postInputs, setpostInputs] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-gray-300 min-h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg h-[430px] w-[400px] shadow-2xl p-6">
        <div className="m-5">
          <div className="text-4xl font-extrabold flex justify-center">
            Get Started
          </div>
          <div className="text-sky-600 font-medium mt-1 flex justify-center">
            Don't have an account?{" "}
            <Link to={"/signup"} className="underline ml-1">
              {" "}
              SignUp{" "}
            </Link>
          </div>
        </div>
        <div className="flex justify-center ">
          <div className="flex flex-col w-[90%] gap-5 justify-center">
            <div className="flex flex-col gap-1">
              <div>Email</div>
              <input
                type="text"
                placeholder="abc@gmail.com"
                className="border border-slate-300 rounded-lg w-full p-2 bg-slate-50"
                value={postInputs.email}
                onChange={(e) => {
                  setpostInputs({
                    ...postInputs,
                    email: e.target.value,
                  });
                }}
              ></input>
            </div>
            <div className="flex flex-col gap-1">
              <div>Password</div>
              <input
                type="password"
                placeholder="*******"
                className="border border-slate-300 rounded-lg w-full p-2 bg-slate-50"
                value={postInputs.password}
                onChange={(e) => {
                  setpostInputs({
                    ...postInputs,
                    password: e.target.value,
                  });
                }}
              ></input>
            </div>
            <div className="mt-1 text-center">
              <button
                className={`w-full rounded-lg p-2.5 text-white 
        ${loading ? "bg-sky-400 cursor-not-allowed" : "bg-sky-600"}`}
                disabled={loading}
                onClick={async () => {
                  if (loading) return;
                  try {
                    setLoading(true);
                    const response = await AuthService.signin(postInputs);
                    setAuth(response.data.token, response.data.user);
                    alert(response.data.message);
                    navigate("/");
                  } catch (error: any) {
                    alert(error.response.data.error);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
              <div className="m-2">
                <Link
                  to={"/forgotpassword"}
                  className="text-md text-sky-600 underline"
                >
                  Forgot Password ?
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default Signin;
