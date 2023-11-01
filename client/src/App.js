import React, { useEffect } from "react";
import "./App.css";
import LoginSignUp from "./Pages/LoginSignUp";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import Main from "./Components/Main";

function App() {
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const webUrl = window.location.href;
    const webUrlArray = webUrl.split("/");
    const length = webUrlArray ? webUrlArray.length - 1 : null;
    const pageName = webUrlArray[length];

    if (token && pageName === "") {
      window.location.replace("/add");
    } else if (pageName !== "" && !token) {
      window.location.replace("/");
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        {!token ? (
          <>
            <Route exact path={"/"} element={<LoginSignUp />} />
            <Route path={"/login"} element={<LoginSignUp />} />
          </>
        ) : (
          <>
            <Route path="/add" element={<Main />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
