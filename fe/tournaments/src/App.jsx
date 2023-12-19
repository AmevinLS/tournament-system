import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Register from "./pages/Register";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />}/>
                    <Route path="register" element={<Register />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
