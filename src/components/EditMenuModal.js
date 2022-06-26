import React from 'react'
import { useForm } from "react-hook-form"
import AuthService from "../services/auth.service"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as bootstrap from 'bootstrap';
import $ from "jquery";

export default function EditExpenseLimitModal({ id, restaurantId, menuName, forceRender, setForceRender, allRestaurants }) {
    const currentUser = AuthService.getCurrentUser();
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit' });

    const hideModal = () => {
        const myModalEl = document.getElementById('id' + id);
        const modal = bootstrap.Modal.getInstance(myModalEl);
        modal.hide();
    };

    const onSubmit = async (data) => {
        const response = await fetch(
            "http://localhost:8080/api/restaurants/menu/",
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.accessToken}`
                },
                body: JSON.stringify({
                    "menuId": id,
                    "restaurantId": data.restaurantId,
                    "name": data.name
                })
            }
        )

        if (response.status === 200) {
            successMessage();
            hideModal();
        }
        else {
            (errorMessage('Klaida!'))
        }

        setForceRender(!forceRender)
    }

    // Popup message configuration
    toast.configure()
    const successMessage = () => {
        toast.success('Pakeitimai išsaugoti', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            theme: "colored",
            pauseOnHover: false,
            hideProgressBar: true
        })
    }
    const errorMessage = (msg) => {
        toast.error(msg, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            theme: "colored",
            pauseOnHover: false,
            hideProgressBar: true
        })
    }

    return (
        <>
            <button
                type="button"
                className="btn"
                data-bs-toggle="modal"
                data-bs-target={"#id" + id}
                style={{ paddingTop: 0, paddingBottom: 10 }}
            >
                <FontAwesomeIcon icon="pen-to-square" className='add__btn__expense' />
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
                                Įrašo redagavimas
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close">
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
                          
                            <select {...register("restaurantId",
                                        {
                                            required: true,
                                        })
                                    }
                                    className="form-control add__description"
                                    type="text"
                                    placeholder="Restorano ID"
                                    defaultValue={restaurantId}
                                    >
                                    {allRestaurants.map((option) => (
                                    <option value={option.id}>{option.name}</option>
                                         ))}
                                </select>

                                <input
                                {...register("name",
                                    {
                                        required: true,
                                        minLength: 3,
                                        maxLength: 20
                                    })
                                }
                                type="text"
                                className="form-control add__description"
                                placeholder="Meniu pavadinimas"
                                defaultValue={menuName}
                            />
                            {errors?.restaurantName?.type === "required" && <p>Laukas negali būti tuščias</p>}
                            {errors?.restaurantName?.type === "minLength" && <p>Aprašymas turi būti sudarytas iš bent 3 simbolių</p>}
                            {errors?.restaurantName?.type === "maxLength" && <p>Aprašymas negali būti ilgesnis negu 10 simbolių</p>}

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
    )
}
