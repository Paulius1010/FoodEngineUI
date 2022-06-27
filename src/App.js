import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import HomeLoggedIn from "./components/HomeLoggedIn";
import Restaurants from "./components/Restaurants";
import Dishes from "./components/Dishes";
import DishOrdering from "./components/DishOrdering";
import Orders from "./components/Orders";
import OrdersAdministration from "./components/OrdersAdministration";
import Menu from "./components/Menu";
import "./components/FontAwesomeIcon/Icons";
import './App.css';
import Navbar from "./components/Navbar";
import AboutUs from "./components/AboutUs";
import Contacts from "./components/Contacts.js";
import { RenderContext } from './components/RenderContext';
import ErrorPage from "./components/ErrorPage";
import Users from "./components/Users";
const App = () => {
  const [render, setRender] = useState(false);

  return (
    <>
      {/* This shows when the screen goes small and user clicks button to expand */}
      <div className="site-mobile-menu site-navbar-target">
        <div className="site-mobile-menu-header">
          <div className="site-mobile-menu-close mt-3">
            <span className="icon-close2 js-menu-toggle"></span>
          </div>
        </div>
        <div className="site-mobile-menu-body"></div>
      </div>

      <RenderContext.Provider value={{ render, setRender }}>
        <header>
          <Navbar />
        </header>

        <main>
          <Routes>
            <Route path={"/"} element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/users" element={<Users />} />
            <Route path="/statistics" element={<HomeLoggedIn />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/dishes" element={<Dishes />} />
            <Route path="/dishordering" element={<DishOrdering />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/ordersadmin" element={<OrdersAdministration />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
      </RenderContext.Provider>
    </>
  );
};
export default App;
