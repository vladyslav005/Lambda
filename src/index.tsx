import React from 'react';
import ReactDOM from 'react-dom/client';
import './ui/common/css/index.css';
import App from './ui/common/component/App';
import reportWebVitals from './ui/common/reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {EditorState} from "./ui/features/lambdainput/context/EditorContext";
import {MathJax, MathJaxContext} from "better-react-mathjax";
import Tex2SVG, { MathJaxProvider } from "react-hook-mathjax";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);


root.render(
    <BrowserRouter>
        <EditorState>
          <App/>
        </EditorState>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
