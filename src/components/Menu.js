import React, { useState, useEffect } from "react";
import "./IncomeAndExpense.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/auth.service";
import { useForm } from "react-hook-form";
import EditMenuModal from "./EditMenuModal";
import DeleteModal from "./DeleteModal";
import Table from "react-bootstrap/Table";
import "./Pagination.css";

export default function Menu() {
  const [allMenus, setAllMenus] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [forceRender, setForceRender] = useState(false);
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const currentUser = AuthService.getCurrentUser();
  const menusSum = allMenus.reduce((n) => n + 1, 0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: "onSubmit", reValidateMode: "onSubmit" });

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

  const onSubmit = async (data) => {
    const response = await fetch(`http://localhost:8080/api/restaurants/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
      body: JSON.stringify({
        restaurantId: data.restaurantId,
        name: data.menuName,
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

  const removeMenu = async (id) => {
    const response = await fetch(`http://localhost:8080/api/restaurants/menu/${id}`, {
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

  return (
    <>
      <div className="container-fluid budget__expense sticky-config">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2>Meniu skaičius: {menusSum}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom ">
        <div className="container">
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
                >
                  <option value={""}>--Pasirinkite restoraną--</option>
                  {allRestaurants.map((option) => (
                    <option value={option.id}>{option.name}</option>
                  ))}
                </select>

                <input
                  {...register("menuName", { required: true, minLength: 3, maxLength: 20 })}
                  type="text"
                  className="form-control add__description"
                  placeholder="Meniu pavadinimas"
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
                {errors?.restaurantId?.type === "required" && (
                  <p>Šis laukas yra privalomas</p>
                )}
              </div>

              <div className="col-sm-3 col-3">
                {errors?.menuName?.type === "required" && (
                  <p>Šis laukas yra privalomas</p>
                )}
                {errors?.menuName?.type === "minLength" && (
                  <p>Aprašymas turi būti bent 3 simbolių ilgio</p>
                )}
                {errors?.menuName?.type === "maxLength" && (
                  <p>Aprašymas negali būti ilgesnis negu 20 simbolių</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container" style={{ paddingRight: 0 }}>
          <div
            className="col-12 expense"
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <div className="expense__list">
              <Table hover>
                <thead>
                  <tr>
                    <th>Restoranas</th>
                    <th>Meniu</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {allMenus.map((menu) => {
                    return (

                      <tr key={menu.id}>
                        <td>{menu.restaurantName}&nbsp;</td>
                        <td>{menu.name}&nbsp;</td>

                        <td
                          style={{
                            textAlign: "right",
                            paddingLeft: 0,
                            paddingRight: 0,
                          }}
                        >
                          <EditMenuModal
                            id={menu.id}
                            restaurantId={menu.restaurantId}
                            menuName={menu.name}
                            forceRender={forceRender}
                            setForceRender={setForceRender}
                            allRestaurants={allRestaurants}
                          />

                          <button
                            onClick={() => showDeleteModal(menu.id)}
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
                  confirmModal={removeMenu}
                  id={deleteId}
                />
              </Table>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
