import React, { useState, useEffect, Component } from "react";
import "./IncomeAndExpense.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/auth.service";
import { useForm } from "react-hook-form";
import EditRestaurantModal from './EditRestaurantModal';
import DeleteModal from './DeleteModal';
import Table from 'react-bootstrap/Table';
import uuid from "react-uuid";

export default function Restaurants() {
  // const [allIncome, setAllIncome] = useState([]);
  const [forceRender, setForceRender] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const currentUser = AuthService.getCurrentUser();
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const restaurantsSum = allRestaurants.reduce((n) => n + 1, 0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onSubmit", reValidateMode: "onSubmit" });

  const onSubmit = async (data, e) => {
    const response = await fetch("http://localhost:8080/api/restaurants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
      body: JSON.stringify({
        name: data.restaurantName,
        entityCode: data.restaurantEntityCode,
        city: data.restaurantCity,
        address: data.restaurantAddress
      }),
    });

    if (response.status === 200) {
      successMessage("Pridėta!");
      reset();
    } else {
      errorMessage("Klaida!");
    }

    setForceRender(!forceRender);
  };

  toast.configure();
  const successMessage = (msg) => {
    toast.success(msg, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      theme: "colored",
      pauseOnHover: false,
      hideProgressBar: true,
    });
  };
  const errorMessage = (msg) => {
    toast.error(msg, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000,
      theme: "colored",
      pauseOnHover: false,
      hideProgressBar: true,
    });
  };

  const removeRestaurant = async (id) => {
    const response = await fetch(`http://localhost:8080/api/restaurants/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
    });

    if (response.status === 200) {
      successMessage("Ištrinta");
    } else {
      errorMessage("Klaida!");
    }

    setForceRender(!forceRender);
    setDisplayDeleteModal(false);
  };

  const showDeleteModal = (id) => {
    setDisplayDeleteModal(true);
    setDeleteId(id);
  };

  const hideDeleteModal = () => {
    setDisplayDeleteModal(false);
  };


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:8080/api/restaurants`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.accessToken}`
          }
        });
      const data = await response.json();
      setAllRestaurants(data);
    };

    fetchData();
  }, [forceRender]);

  return (
    <>
      <div className="container-fluid budget__income sticky-config">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2>Restoranų skaičius: {restaurantsSum}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom">
        <div className="container">
          <div className="add">
            <div className="row text-center add__container">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="input-group my-3"
              >
                <input
                  {...register("restaurantName", { required: true, minLength: 3, maxLength: 20 })}
                  type="text"
                  className="form-control add__description"
                  placeholder="Restorano pavadinimas"
                />
                                
                <input
                  {...register("restaurantEntityCode", { required: true, minLength: 3, maxLength: 20 })}
                  type="text"
                  className="form-control add__description"
                  placeholder="Restorano kodas"
                />

                <input
                  {...register("restaurantCity", { required: true, minLength: 3, maxLength: 20 })}
                  type="text"
                  className="form-control add__description"
                  placeholder="Miestas"
                />

                <input
                  {...register("restaurantAddress", { required: true, minLength: 3, maxLength: 20 })}
                  type="text"
                  className="form-control add__description"
                  placeholder="Adresas"
                />

                <div className="input-group-append">
                  <button className="btn" type="submit">
                    <FontAwesomeIcon
                      icon={faCirclePlus}
                      className="add__btn__income"
                    />
                  </button>
                </div>
              </form>
            </div>

            <div className="row ">
              <div className="col-sm-4 col-4">
                {errors?.restaurantName?.type === "required" && (
                  <p>Šis laukas yra privalomas</p>
                )}
                {errors?.restaurantName?.type === "minLength" && (
                  <p>Aprašymas turi būti bent 3 simbolių ilgio</p>
                )}
                {errors?.restaurantName?.type === "maxLength" && (
                  <p>Aprašymas negali būti ilgesnis negu 20 simbolių</p>
                )}
              </div>

              </div>
            </div>
          </div>
        </div>

        {/* <div className="mt-5 list"> */}
        <div className="container" style={{ paddingRight: 0 }}>
          <div
            className="col-12 income__list"
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <div className="income__list">
              <Table hover>
                <thead>
                  <tr>
                    <th>Restorano pavadinimas</th>
                    <th>Miestas</th>
                    <th>Adresas</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {allRestaurants.map((restaurant) => {
                    return (
                      <tr key={uuid()}>
                        <td>{restaurant.name}&nbsp;</td>
                        <td>{restaurant.city}&nbsp;</td>
                        <td>{restaurant.address}&nbsp;</td>

                        <td
                          style={{
                            textAlign: "right",
                            paddingLeft: 0,
                            paddingRight: 0,
                          }}
                        >
                          <EditRestaurantModal
                            id={restaurant.id}
                            restaurantName={restaurant.name}
                            restaurantEntityCode={restaurant.entityCode}
                            restaurantCity={restaurant.city}
                            restaurantAddress={restaurant.address}
                            forceRender={forceRender}
                            setForceRender={setForceRender}
                          />

                          <button
                            onClick={() => showDeleteModal(restaurant.id)}
                            className="btn"
                            type="button"
                            style={{ paddingTop: 0, paddingBottom: 10 }}
                          >
                            <FontAwesomeIcon
                              icon="trash"
                              className="add__btn__income"
                              style={{ width: "20px" }}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                <DeleteModal
                  showModal={displayDeleteModal}
                  hideModal={hideDeleteModal}
                  confirmModal={removeRestaurant}
                  id={deleteId}
                />
              </Table>
            </div>
          </div>
        </div>
    </>
  );
}
