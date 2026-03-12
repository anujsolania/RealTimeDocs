import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import Password from "./pages/Password";
import Home from "./pages/Home";
import Document from "./pages/Document";
import { ProtectedRoutes } from "./protectedRoutes/ProtectedRoutes";

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      {isMobile && !dismissed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center flex flex-col gap-4">
            <div className="text-4xl">💻</div>
            <h2 className="text-xl font-bold text-gray-800">Best on Desktop</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              RealTimeDocs is designed for larger screens. For the best
              experience, please open it on a desktop or laptop browser.
            </p>
            <button
              onClick={() => setDismissed(true)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/verifyemail" element={<Verify />}></Route>
          <Route
            path="/verifyemail/:verificationToken"
            element={<Verify />}
          ></Route>
          <Route path="/forgotpassword" element={<Password />}></Route>
          <Route
            path="/forgotpassword/:resetpasswordToken"
            element={<Password />}
          ></Route>
          <Route
            path="/resetpassword/:resetpasswordToken"
            element={<Password />}
          ></Route>

          <Route element={<ProtectedRoutes />}>
            <Route path="/document/:documentId" element={<Document />}></Route>
            <Route path="/" element={<Home />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
