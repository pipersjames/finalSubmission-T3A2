import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import Cookies from 'js-cookie';
import logo from '../assets/form.png'

export default function Navbar() {

    const auth = Cookies.get('auth')

    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            Cookies.remove('jwt');
            Cookies.remove('auth')
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
            <div className="container">
            <NavLink className="navbar-brand d-flex align-items-center" to="/home">
                    <img src={logo} alt="Stream-Lined Logo" height="30" className="me-2" />
                    Stream-Lined
                </NavLink>
                <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/home">Home</NavLink>
                        </li>
                        {(auth === 'admin' || auth === 'manager') && (<li className="nav-item">
                            <NavLink className="nav-link" to="/FormBuilder">Form Builder</NavLink>
                        </li>)}
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/Forms">Forms</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/Actions">Actions</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/" onClick={handleLogout}>Logout</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
