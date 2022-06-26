import React, { useState, useEffect } from "react";
import "./IncomeAndExpense.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/auth.service";
import { useForm } from "react-hook-form";
import EditDishModal from "./EditDishModal";
import DeleteModal from "./DeleteModal";

import ReactPaginate from "react-paginate";
import Table from "react-bootstrap/Table";
import ReactCSV from "./ReactCSV";
import Accordion from 'react-bootstrap/Accordion'
import "./Pagination.css";
import uuid from "react-uuid";


export default function Dishes() {
  const [allMenus, setAllMenus] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState([]);
  const [selectedRestaurantMenus, setSelectedRestaurantMenus] = useState([]);
  const [allDishes, setAllDishes] = useState([]);

  const [forceRender, setForceRender] = useState(false);
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const currentUser = AuthService.getCurrentUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onSubmit", reValidateMode: "onSubmit" });

  let today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  useEffect(() => {
    const fetchRestaurantsData = async () => {
      const restaurantsResponse = await fetch(
        `http://localhost:8080/api/restaurants`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        }
      );
      const restaurantsData = await restaurantsResponse.json();
      setAllRestaurants(restaurantsData);
    };
    fetchRestaurantsData();
  }, [forceRender]);


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
  }, [selectedRestaurantId]);

  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:8080/api/restaurants/menu`,
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.accessToken}`
        }
      });
      const data = await response.json();
      setAllMenus(data);
    };
    fetchData();
  }, [forceRender]);

  const onSubmit = async (data) => {
    const response = await fetch("http://localhost:8080/api/restaurants/menu/dishes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
      body: JSON.stringify({
        restaurantId: data.restaurantId,
        menuId: data.menuId,
        name: data.dishName,
        description: data.dishDescription,
        price: data.dishPrice,
        preparationTimeInMinutes: data.dishTime,
      }),
    });

    if (response.status === 200) {
      successMessage("Pridėta");
      reset();
    } else {
      errorMessage("Klaida!");
    }
    setForceRender(!forceRender);
  };

  // Popup message configuration
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

  const removeDish = async (id) => {
    const response = await fetch(`http://localhost:8080/api/restaurants/menu/dishes/${id}`, {
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


  const dishesSum = allDishes.reduce((n) => n + 1, 0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:8080/api/restaurants/menu/dishes`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        }
      );
      const data = await response.json();
      setAllDishes(data);
    };
    fetchData();
  }, [forceRender]);




  return (
    <>


      <div className="container-fluid budget__expense sticky-config">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2>Patiekalų skaičius: {dishesSum} </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom ">
        <div className="container">
          <div >
            <Accordion defaultActiveKey="0" >
              <Accordion.Item eventKey="0" >
                <Accordion.Header >Naujas įrašas</Accordion.Header>
                <Accordion.Body >
                  <div className="add">
                    <div className="row text-center add__container">
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="col-12 col-sm-6 col-md-6 col-lg-6 input-group my-3"
                      >

                        <select
                          {...register("restaurantId", {
                            required: true,
                          })}
                          className="form-control add__description"
                          type="text"
                          onChange={(e) =>  setSelectedRestaurantId(e.target.value) }
                        >
                          <option value={""}>--Pasirinkite restoraną--</option>
                          {allRestaurants.map((option) => (
                            <option value={option.id}>{option.name}</option>
                          ))}

                        </select>

                        <select
                          {...register("menuId", {
                            required: true,
                          })}
                          className="form-control add__description"
                          type="text"
                        >
                          <option value={""}>--Pasirinkite meniu--</option>
                          {selectedRestaurantMenus.map((option) => (
                            <option value={option.id}>{option.name}</option>
                          ))}
                        </select>


                        <input
                          {...register("dishName", { required: true, minLength: 3, maxLength: 20 })}
                          type="text"
                          className="form-control add__description"
                          placeholder="Pavadinimas"
                        />

                        <input
                          {...register("dishDescription", { required: true, minLength: 3, maxLength: 20 })}
                          type="text"
                          className="form-control add__description"
                          placeholder="Apibūdinimas"
                        />
                        <input
                          {...register("dishPrice", { required: true, minLength: 3, maxLength: 20 })}
                          type="text"
                          className="form-control add__description"
                          placeholder="Kaina"
                        />

                        <input
                          {...register("dishTime", {
                            required: true,
                            min: 1,
                          })}
                          type="number"
                          className="form-control add__value"
                          placeholder="Paruošimo trukmė"
                          step="1"
                        />

                        <div className="input-group-append">
                          <button className="btn" type="submit">
                            <FontAwesomeIcon
                              icon={faCirclePlus}
                              className="add__btn__expense"
                            />
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="row ">
                      <div className="col-sm-3 col-3">
                        {errors?.expenseName?.type === "required" && (
                          <p>Šis laukas yra privalomas</p>
                        )}
                        {errors?.expenseName?.type === "minLength" && (
                          <p>Aprašymas turi būti bent 3 simbolių ilgio</p>
                        )}
                        {errors?.incomeName?.type === "maxLength" && (
                          <p>Aprašymas negali būti ilgesnis negu 10 simbolių</p>
                        )}
                      </div>

                      <div className="col-sm-3 col-3">
                        {errors?.dishTime?.type === "required" && (
                          <p>Šis laukas yra privalomas</p>
                        )}
                        {errors?.dishTime?.type === "min" && (
                          <p>Mažiausia trukmė 1 min</p>
                        )}
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

            </Accordion>
          </div>
        </div>

        {/* <div className="mt-5 list"> */}
        <div className="container" style={{ paddingRight: 0 }}>
          <div
            className="col-12 expense"
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            {/* <h2 className="expense__title">Išlaidos</h2> */}
            <div className="expense__list">
              <Table hover>
                <thead>
                  <tr>
                    <th>Restoranas</th>
                    <th>Meniu</th>
                    <th>Pavadinimas</th>
                    <th>Aprašymas</th>
                    <th>Kaina</th>
                    <th>Trukmė</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {allDishes.map((dish) => {
                    return (

                      <tr key={dish.id}>
                        <td>{dish.restaurantName}&nbsp;</td>
                        <td>{dish.menuName}&nbsp;</td>
                        <td>{dish.name}&nbsp;</td>
                        <td>{dish.description}&nbsp;</td>
                        <td>{dish.price}&nbsp;</td>
                        <td>{dish.preparationTimeInMinutes}&nbsp;</td>


                        <td

                          style={{
                            textAlign: "right",
                            paddingLeft: 0,
                            paddingRight: 0,
                          }}
                        >
                          <EditDishModal
                            id={dish.id}
                            restaurantId={dish.restaurantId}
                            menuId={dish.menuId}
                            dishName={dish.name}
                            dishDescription={dish.description}
                            dishPrice={dish.price}
                            dishTime={dish.preparationTimeInMinutes}
                            forceRender={forceRender}
                            setForceRender={setForceRender}
                            allRestaurants={allRestaurants}
                            allMenus={allMenus}
                            />

                          <button
                            onClick={() => showDeleteModal(dish.id)}
                            className="btn"
                            type="button"
                            style={{ paddingTop: 0, paddingBottom: 10 }}
                          >
                            <FontAwesomeIcon
                              icon="trash"
                              className="add__btn__expense"
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
                  confirmModal={removeDish}
                  id={deleteId}
                />
              </Table>
            </div>

          </div>
          {/* This section is CSV export button */}
          <button type="submit" className="btn btn-lg" style={{ float: "right", backgroundColor: "#008F8C" }}>
            <ReactCSV allDishes={allDishes} />
          </button>

        </div>
      </div>
    </>
  );
}
