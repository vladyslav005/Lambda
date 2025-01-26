import React from 'react';

import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {EditorState} from "./features/lambda-input/context/EditorContext";
import {Toaster} from "react-hot-toast";


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);


root.render(
    <BrowserRouter>
      <EditorState>
        <Toaster
            toastOptions={{
              position: "top-center",
              style: {
                color: "#49454F",
                fontFamily: "Roboto",
                fontSize: "var(--Body-Medium-Size, 14px)", // Correcting font-size property
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "var(--Body-Medium-Line-Height, 20px)", // Correcting line-height
                letterSpacing: "var(--Body-Medium-Tracking, 0.25px)", // Correcting letter-spacing
              }
            }}
        />
        <App/>
      </EditorState>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
