import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import {MainPage} from "./pages/main-page/MainPage";
import {Toaster} from "react-hot-toast";

function App() {
  return (
      <>
        <Toaster
            toastOptions={{
              position: "top-center",
              style: {
                color: "var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))",
                fontFamily: "Roboto",
                fontSize: "var(--Body-Medium-Size, 14px)",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "var(--Body-Medium-Line-Height, 20px)",
                letterSpacing: "var(--Body-Medium-Tracking, 0.25px)",
                zIndex: 1000000,
              }
            }}
        />
        <Routes>

          <Route path="/" element={<MainPage/>}/>
        </Routes>
      </>
  );
}

export default App;
