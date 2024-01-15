import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Register from "./pages/Register";
import Login from './pages/Login';
import AllTournaments from "./pages/AllTournaments";
import TournamentDetails from './pages/TournamentDetails';
import EditTournament from './pages/EditTournament';
import Account from './pages/Account';


function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />}/>
                    <Route path="tournaments" element={<AllTournaments />} />
                    <Route path="tournament_details" element={<TournamentDetails />}/>
                    <Route path="tournament_edit" element={<EditTournament />}/>
                    <Route path="register" element={<Register />}/>
                    <Route path="login" element={<Login />}/>
                    <Route path="account" element={<Account/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
