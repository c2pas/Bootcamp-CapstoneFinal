import React, { useEffect, useState } from 'react';
import {
    Link
  } from "react-router-dom";
import "../assets/css/style.css"
import "../assets/material-icon/css/material-design-iconic-font.min.css"


async function loginUser(credentials) {
    return fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
}

function Login() {
    const [token, setToken] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const data = await loginUser({
          email,
          password
        });
        setToken(data?.token);

        console.log('token', JSON.parse(atob(data?.token.split('.')[1])))
      }    

    return (
        <section className="sign-in">
            <div className="container">
                {!!token ? (<div>Your login Token: {token}</div>) :
                    (<div className="signin-content">
                        <div className="signin-image">
                        <figure>
                            <img src="images/signin-image.jpg" />
                        </figure>
                            <Link to="/register" className="signup-image-link">Create an account</Link>
                        </div>
                        <div className="signin-form">
                        <h2 className="form-title">Sign In</h2>
                        <form
                            onSubmit={handleSubmit}
                            className="register-form"
                            id="login-form"
                        >
                            <div className="form-group">
                            <label htmlFor="username">
                                <i className="zmdi zmdi-account material-icons-name" />
                            </label>
                            <input 
                                type="text" 
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Your Email"
                                name="email"
                                id="username"
                            />
                            </div>
                            <div className="form-group">
                            <label htmlFor="password">
                                <i className="zmdi zmdi-lock" />
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                            </div>
                            <div className="form-group">
                            <input
                                type="checkbox"
                                name="remember-me"
                                id="remember-me"
                                className="agree-term"
                            />
                            <label htmlFor="remember-me" className="label-agree-term">
                                <span>
                                <span />
                                </span>
                                Remember me
                            </label>
                            </div>
                            <div className="form-group form-button">
                            <input
                                type="submit"
                                name="signin"
                                id="signin"
                                className="form-submit"
                                defaultValue="Log in"
                            />
                            </div>
                        </form>
                        </div>
                    </div>)
                }
            </div>
        </section>
    );
}

export default Login;