import React, { useRef, useState } from 'react'
import { useForm } from "react-hook-form";
import AuthService from "../services/auth.service";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

export default function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit' });
    const navigate = useNavigate();
    const [usedLogin, setUsedLogin] = useState("")
    const onSubmit = data => {
        AuthService.register(data)
            .then(() => successMessage())
            .then(() => navigate("/login"))
            .catch(error => {
                setUsedLogin(error.response.data.message.length)
                console.log(error.response.data.message.length)
            })
    }

    // Popup message configuration
    toast.configure()
    const successMessage = () => {
        toast.success('Prisiregistruota! Jau galite prisijungti prie savo paskyros', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            theme: "colored",
            pauseOnHover: false,
            hideProgressBar: true,
            keepAfterRouteChange: true
        })
    }

    const password = useRef({});
    password.current = watch("password", "");

    return (
        <section className="vh-100">
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-5">
                    <div className="col-lg-12 col-xl-11">
                        <div className="card text-black" style={{ borderRadius: "25px", marginTop: "1em" }}>
                            <div className="card-body p-md-5">
                                <div className="row justify-content-center">
                                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Registracija
                                        </p>

                                        <form onSubmit={handleSubmit(onSubmit)} className="mx-1 mx-md-4">
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="form3Example1c">
                                                        Jūsų vardas
                                                    </label>
                                                    <input
                                                        {...register("username", { required: true, minLength: 2 })}
                                                        className="form-control"
                                                    />
                                                    {errors?.username?.type === "required" && <p>Vardas yra būtinas</p>}
                                                    {errors?.username?.type === "minLength" && <p>Vardas turi būti bent 2 simbolių ilgio</p>}
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <label className='mb-2'>El. paštas</label>
                                                    <input
                                                        {...register("email",
                                                            {
                                                                required: true,
                                                                pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                                                            })}
                                                        className="form-control"
                                                    />
                                                    {errors?.email?.type === "required" && <p>El. paštas būtinas</p>}
                                                    {errors?.email?.type === "pattern" && <p>El. paštas turi būti galiojantis</p>}
                                                    {usedLogin === 31 && <p>El. paštas jau yra naudojamas</p>}
                                                </div >
                                            </div >

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <label className='mb-2'>Slaptažodis</label>
                                                    <input
                                                        {...register("password",
                                                            {
                                                                required: true,
                                                                minLength: 6
                                                            })
                                                        }
                                                        type="password"
                                                        className='form-control'
                                                    />
                                                    {errors?.password?.type === "required" && <p>Slaptažodis būtinas</p>}
                                                    {errors?.password?.type === "minLength" && <p>Slaptažodis turi būti bent 6 raidžiu ilgumo</p>}
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                                                <div className="form-outline flex-fill mb-0">
                                                    <label className='mb-2'>Pakartoti slaptažodį</label>
                                                    <input
                                                        {...register("password_repeat",
                                                            {
                                                                validate: value =>
                                                                    value === password.current || "Slaptažodžiai nesutampa"
                                                            })
                                                        }
                                                        type="password"
                                                        className='form-control'
                                                    />
                                                    {errors.password_repeat && <p>{errors.password_repeat.message}</p>}
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                <button type="submit" className="btn btn-primary btn-lg">Registruotis</button>
                                            </div>
                                        </form >

                                    </div >
                                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp" className="img-fluid" alt="Sample image" />
                                    </div>
                                </div >
                            </div >
                        </div >
                    </div >
                </div >
            </div >
        </section >
    );
}
