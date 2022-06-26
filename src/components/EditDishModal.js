import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form"
import AuthService from "../services/auth.service"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as bootstrap from 'bootstrap';
import $ from "jquery";

export default function EditDishModal({ id, restaurantId, menuId, dishName, dishDescription, dishPrice, dishTime, forceRender, setForceRender, allRestaurants, allMenus}) {
    const currentUser = AuthService.getCurrentUser();
    const [selectedRestaurantId, setSelectedRestaurantId] = useState([]);
    const [selectedRestaurantMenus, setSelectedRestaurantMenus] = useState(allMenus);
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit' });
    
    const hideModal = () => {
        const myModalEl = document.getElementById('id' + id);
        const modal = bootstrap.Modal.getInstance(myModalEl);
        modal.hide();
    };

        
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:8080/api/restaurants/${selectedRestaurantId}/menu`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.accessToken}`
          }
        });
      const data = await response.json();
      setSelectedRestaurantMenus(data);
    };
    fetchData();
  }, [forceRender]);


    const onSubmit = async (data) => {
        const response = await fetch(
            "http://localhost:8080/api/restaurants/menu/dishes/",
            {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.accessToken}`
                },
                body: JSON.stringify({
                    dishId: id,
                    restaurantId: data.restaurantId,
                    menuId: data.menuId,
                    name: data.dishName,
                    description: data.dishDescription,
                    price: data.dishPrice,
                    preparationTimeInMinutes: data.dishTime,
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
                        <select
                          {...register("restaurantId", {
                            required: true,
                          })}
                          className="form-control add__description"
                          type="text"
                          defaultValue={restaurantId}
                          onChange={(e) => { setSelectedRestaurantId(e.target.value); setForceRender(!forceRender); }}
                        >
                          {allRestaurants.map((option) => (
                            <option value={option.id}>{option.name}</option>
                          ))}

                        </select>
                            {errors?.restaurantId?.type === "required" && <p>Laukas negali būti tuščias</p>}

                            <select
                          {...register("menuId", {
                            required: true,
                          })}
                          className="form-control add__description"
                          type="text"
                          defaultValue={menuId}
                          >
                          {selectedRestaurantMenus.map((option) => (
                            <option value={option.id}>{option.name}</option>
                          ))}
                        </select>
                           

                        <input
                          {...register("dishName", { required: true, minLength: 3, maxLength: 20 })}
                          type="text"
                          className="form-control add__description"
                          placeholder="Pavadinimas"
                          defaultValue={dishName}
                          />

                        <input
                          {...register("dishDescription", { required: true, minLength: 3, maxLength: 20 })}
                          type="text"
                          className="form-control add__description"
                          placeholder="Apibūdinimas"
                          defaultValue={dishDescription}
                          />
                        <input
                          {...register("dishPrice", { required: true, minLength: 3, maxLength: 20 })}
                          type="text"
                          className="form-control add__description"
                          placeholder="Kaina"
                          defaultValue={dishPrice}
                          />

                        <input
                          {...register("dishTime", {
                            required: true,
                            min: 1,
                          })}
                          type="number"
                          className="form-control add__value"
                          defaultValue={dishTime}
                          placeholder="Paruošimo trukmė"
                          step="1"
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
    )
}
