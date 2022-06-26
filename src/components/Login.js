import React, { useState, useContext } from 'react';
import { useForm } from "react-hook-form";
import AuthService from "../services/auth.service";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { RenderContext } from './RenderContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit' });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { render, setRender } = useContext(RenderContext);

    const onSubmit = data => {
        AuthService.login(data.email, data.password)
            .then(() => {
                fetch(`http://localhost:8080/api/user/${data.email}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.roles.some(role => role.name === "ROLE_ADMIN")) {
                            // navigate("/admin");
                            navigate("/users");
                            setRender(!render);
                        } else {
                            navigate("/income");
                            setRender(!render);
                        }
                    });
            })
            .catch(() => setMessage("El. paštas arba slaptažodis yra neteisingas"));
    };

    const [passwordShown, setPasswordShown] = useState(false);

  // Password toggle handler
  const togglePassword = () => {
    // When the handler is invoked
    // chnage inverse the boolean state passwordShown
    setPasswordShown(!passwordShown);
  };

    return (
        <section className="vh-100">
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-5">
                    <div className="col-xl-12 col-lg-11">
                        <div className="card text-black" style={{ borderRadius: "25px", marginTop: "1em" }}>
                            <div className="card-body p-md-5">
                                <div className="row justify-content-center">
                                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw1.webp" className="img-fluid" alt="Sample image" />
                                    </div>
                                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                                        <form onSubmit={handleSubmit(onSubmit)}>

                                            <p className="text-center h1 fw-normal mb-5 mx-1 mx-md-4 mt-4">Prisijungimas</p>

                                            <div className="form-outline mb-4">
                                                <label className="form-label" htmlFor="form3Example3">El. paštas</label>
                                                <input {...register("email", { required: true })} className="form-control" />
                                                {errors?.email?.type === "required" && <p>Įveskite el. paštą</p>}
                                            </div>

                                            <div className="form-outline mb-3">                                           
                                                <label className="form-label" htmlFor="form3Example4">Slaptažodis</label>                                                                                
                                                <input {...register("password", { required: true })} type={passwordShown ? "text" : "password"} id='password' className='form-control'  />
                                                {errors?.password?.type === "required" && <p>Įveskite Slaptažodį</p>}
                                                {message && message}  
                                                <div style={{paddingTop: 10}}> 
                                                <input type="checkbox" onClick={togglePassword}/> Rodyti slaptažodį
                                                </div>
                                            </div>
                                            
                                            <div className="text-lg-start mt-4 pt-2">
                                                <button type="submit" className="btn btn-primary btn-lg"
                                                    style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}>Prisijungti</button>

                                                <p className="small fw-bold mt-2 pt-1 mb-0">Dar nesate užsiregistravęs? <Link to={"/register"} className="link-danger">Registruotis</Link></p>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </section >
    );
}