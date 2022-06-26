import React, { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import AuthService from "../services/auth.service";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { checked } from 'glamor';
import * as bootstrap from 'bootstrap';
import $ from "jquery";

export default function EditUserModal({ id, username, email, roles, forceRender, setForceRender }) {
    const currentUser = AuthService.getCurrentUser();
    const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit' });
    // console.log(roles.some(item => item.name === "ROLE_ADMIN"));
    const password = useRef({});
    password.current = watch("password", "");
    // const isAdmin = roles.some(item => item.name === "ROLE_ADMIN");
    const [submitResponse, setSubmitResponse] = useState(null);

    const hideModal = () => {
        const myModalEl = document.getElementById('id' + id);
        const modal = bootstrap.Modal.getInstance(myModalEl);
        modal.hide();
    };

    const onSubmit = async (data) => {
        let admin = "";

        if (data.admin) {
            admin = "admin";
        }

        const response = await fetch(
            `http://localhost:8080/api/user/${id}`,
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.accessToken}`
                },
                body: JSON.stringify({
                    "id": id,
                    "username": data.username,
                    "email": data.email,
                    "password": (data.password ? data.password : undefined),
                    "role": [admin, "user"]
                })
            }
        );

        if (response.status === 200) {
            successMessage();
            hideModal();
        }
        else if (response.status !== 400) {
            (errorMessage('Klaida!'));
        }

        setSubmitResponse(response.status);
        setForceRender(!forceRender);
    };

    // Popup message configuration
    toast.configure();
    const successMessage = () => {
        toast.success('Pakeitimai išsaugoti', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            theme: "colored",
            pauseOnHover: false,
            hideProgressBar: true
        });
    };
    const errorMessage = (msg) => {
        toast.error(msg, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            theme: "colored",
            pauseOnHover: false,
            hideProgressBar: true
        });
    };

    return (
        <>
            <button
                type="button"
                className="btn"
                data-bs-toggle="modal"
                data-bs-target={"#id" + id}
            >
                <FontAwesomeIcon
                    icon="pen-to-square"
                    className='add__btn__income'
                />
            </button>

            <div
                className="modal"
                id={"id" + id}
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id="staticBackdropLabel"
                            >
                                Redaguoti vartotoją
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close">
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="modal-body"
                        >
                            <input
                                {...register("username",
                                    {
                                        required: true,
                                        minLength: 4
                                    })
                                }
                                type="text"
                                className="form-control add__description"
                                placeholder="Vardas"
                                defaultValue={username}
                            />
                            {
                                errors?.username?.type === "required" &&
                                <p>Laukas negali būti tuščias</p>
                            }
                            {
                                errors?.username?.type === "minLength" &&
                                <p>Vardas turi būti sudarytas iš bent 4 simbolių</p>
                            }

                            <input
                                {...register("email",
                                    {
                                        required: true,
                                        minLength: 4
                                    })
                                }
                                type="email"
                                className="form-control add__value mt-2"
                                placeholder="El. paštas"
                                defaultValue={email}
                            />
                            {
                                errors?.email?.type === "required" &&
                                <p>Laukas negali būti tuščias</p>
                            }
                            {
                                errors?.email?.type === "min" &&
                                <p>El-paštas turi būti sudarytas iš bent 4 simbolių &euro;</p>
                            }
                            {/* {
                                submitResponse === 400 &&
                                <p>El. paštas jau yra naudojamas</p>
                            } */}

                            <input
                                {...register("password",
                                    {
                                        // required: true,
                                        minLength: 6
                                    })
                                }
                                type="password"
                                className="form-control add__description mt-2"
                                placeholder="Slaptažodis"
                            />
                            {/* {errors?.password?.type === "required" && <p>Laukas negali būti tuščias</p>} */}
                            {
                                errors?.password?.type === "minLength" &&
                                <p>Slaptažodis turi būti sudarytas iš bent 6 simbolių</p>
                            }

                            <input
                                {...register("password_repeat",
                                    {
                                        validate: value =>
                                            value === password.current || "Slaptažodžiai nesutampa"
                                    })
                                }
                                type="password"
                                className='form-control mt-2'
                                placeholder='Pakartoti slaptažodį'
                            />
                            {errors.password_repeat && <p>{errors.password_repeat.message}</p>}

                            <label
                                htmlFor="admin"
                                className="ms-1"
                            >
                                Administratorius
                            </label>
                            <input
                                {...register("admin")}
                                name='admin'
                                type="checkbox"
                                className="ms-1"
                                defaultChecked={roles.some(item => item.name === "ROLE_ADMIN") ? true : false}
                            />

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Uždaryti
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Išsaugoti
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
