import React, { useState, useEffect, useContext } from "react";
import { useLocation, NavLink } from "react-router-dom";
import AuthService from "../services/auth.service";
import "../navbar bootstrap/bootstrap.module.min.css";
import "./Navbar.css";
import { RenderContext } from "./RenderContext";
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navbar() {
    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    const location = useLocation();
    const { render } = useContext(RenderContext);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
            setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
            setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
        }

    }, [render]);

    const logOut = () => {
        AuthService.logout();
    };

    return (
        <div className="site-navbar site-navbar-target bg-white"
            role="banner">
            <div className="container">
                <div className="row align-items-center position-relative">
                    <div className="col-lg-4" style={{ paddingLeft: 0 }}>
                        <nav className="site-navigation ml-auto "
                            role="navigation">
                            <ul className="site-menu main-menu js-clone-nav ml-auto d-none d-lg-block">
                                {showAdminBoard ? (
                                    <li id="button-hover">
                                        {/* <NavLink to={"/"}
                                            className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                                            Namai
                                        </NavLink> */}
                                    </li>
                                ) : currentUser ? (
                                    <>
                                        <li id="button-hover">
                                            <NavLink to={"/statistics"}
                                                className={({ isActive }) => (isActive ? 'active' : 'inactive')} >
                                                Statistika
                                            </NavLink>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li id="button-hover">
                                            <NavLink to={"/"}
                                                className={({ isActive }) => (isActive ? 'active' : 'inactive')}
                                            >

                                                <FontAwesomeIcon
                                                    icon={faHome}
                                                    id="home_button"
                                                />

                                            </NavLink>
                                        </li>
                                    </>
                                )}

                                {showAdminBoard ? (
                                    <>
                                        <li id="button-hover">
                                            <NavLink to={"/users"}
                                                className={({ isActive }) => (isActive ? 'active' : 'inactive')} >
                                                Vartotojai
                                            </NavLink>
                                        </li>
                                        <li id="button-hover">
                                            <NavLink to={"/orders"}
                                                className={({ isActive }) => (isActive ? 'active' : 'inactive')} >
                                                Patiekalų pasirinkimas
                                            </NavLink>
                                        </li>
                                        <li id="button-hover">
                                            <NavLink to={"/restaurants"}
                                                className={({ isActive }) => (isActive ? 'active' : 'inactive')} >
                                                Restoranai
                                            </NavLink>
                                        </li>
                                        <li id="button-hover">
                                            <NavLink to={"/menu"}
                                                className={({ isActive }) => (isActive ? 'active' : 'inactive')} >
                                                Meniu
                                            </NavLink>
                                        </li>
                                        <li id="button-hover">
                                            <NavLink to={"/dishes"}
                                                className={({ isActive }) => (isActive ? 'active' : 'inactive')} >
                                                Patiekalai
                                            </NavLink>
                                        </li>
                                        {/* <li id="button-hover">
                                            <a href="/"
                                                onClick={logOut}>
                                                Atsijungti
                                            </a>
                                        </li> */}
                                    </>
                                ) : currentUser ? (
                                    <>
                                        <li id="button-hover">
                                            <NavLink to={"/orders"}
                                                className={({ isActive }) => (isActive ? 'active' : 'inactive')} >
                                                Patiekalų pasirinkimas
                                            </NavLink>
                                        </li>

                                    </>
                                ) : (
                                    <>
                                        <li id="button-hover">
                                            <NavLink to={"/login"}
                                                className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                                                Prisijungti
                                            </NavLink>
                                        </li>
                                        <li id="button-hover">
                                            <NavLink to={"/register"}
                                                className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                                                Registruotis
                                            </NavLink>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                    <div className="col-lg-4 text-center">
                        <div className="site-logo">
                            {showAdminBoard ? (
                                <>
                                    <div >
                                        <NavLink to={"/"}
                                            className={({ isActive }) => (isActive ? 'active' : 'inactive')} >
                                            LOGO
                                        </NavLink>
                                    </div>
                                </>
                            ) : currentUser ? (
                                <>
                                    <div >
                                        <NavLink to={"/restaurants"}
                                            className={({ isActive }) => (isActive ? 'active' : 'inactive')} >
                                            LOGO
                                        </NavLink>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div >
                                        <NavLink to={"/"}
                                            className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                                            LOGO
                                        </NavLink>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="ml-auto toggle-button d-inline-block d-lg-none">
                            <a href="vtmc.lt"
                                className="site-menu-toggle py-5 js-menu-toggle text-black"
                            >
                                <span className="icon-menu h3 text-black"></span>
                            </a>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <nav className="site-navigation text-left mr-auto "
                            role="navigation">
                            <ul className="site-menu main-menu js-clone-nav ml-auto d-none d-lg-block text-right">
                                {!currentUser && (
                                    <>
                                        <li id="button-hover">
                                            <NavLink to={"/aboutus"}
                                                className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                                                Apie mus
                                            </NavLink>
                                        </li>
                                        <li id="button-hover">
                                            <NavLink to={"/contacts"}
                                                className={({ isActive }) => (isActive ? 'active' : 'inactive')}>
                                                Kontaktai
                                            </NavLink>
                                        </li>
                                    </>
                                )}

                                {showAdminBoard ? (
                                    <>
                                        <li id="button-hover">
                                            <a href="/"
                                                onClick={logOut}>
                                                Atsijungti
                                            </a>
                                        </li>
                                    </>
                                ) : currentUser ? (
                                    <>
                                        <li id="button-hover">
                                            <a href="/"
                                                onClick={logOut}>
                                                Atsijungti
                                            </a>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        {/* <li id="button-hover">
                                            <a href="/"
                                                onClick={logOut}>
                                                Atsijungti
                                            </a>
                                        </li> */}
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Insert the break element everywhere but homepage */}
            {/* {location.pathname === "/" ? "" : < hr />} */}
        </div>
    );
}
