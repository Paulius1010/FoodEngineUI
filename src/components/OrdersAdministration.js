import React, { useState, useEffect } from "react";
import "./IncomeAndExpense.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/auth.service";
import OrderDecreaseModal from "./OrderDecreaseModal";
import OrderModal from "./OrderIncreaseModal";
import Table from "react-bootstrap/Table";
import ReactCSV from "./ReactCSV";
import Accordion from 'react-bootstrap/Accordion'

export default function OrdersAdministration() {
  const [allOrders, setAllOrders] = useState([]);
  const [allDishes, setAllDishes] = useState([]);
  const [forceRender, setForceRender] = useState(false);
  const [displayOrderDecreaseModal, setDisplayOrderDecreaseModal] = useState(false);
  const [displayOrderModal, setDisplayOrderModal] = useState(false);
  const [orderDecreaseId, setOrderDecreaseId] = useState();
  const [orderId, setOrderId] = useState();
  const [userId, setUserId] = useState();
  const currentUser = AuthService.getCurrentUser();


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:8080/api/orders/all`,
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.accessToken}`
        }
      });
      const data = await response.json();
      setAllOrders(data);
    };
    fetchData();
  }, [forceRender]);

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
    const response = await fetch(`http://localhost:8080/api/orders/${userId}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
    });

    if (response.status === 200) {
      successMessage("Sumažinta");
    } else {
      errorMessage("Klaida!");
    }

    setForceRender(!forceRender);
    setDisplayOrderDecreaseModal(false);
  };

  const orderDish = async (id) => {
    const response = await fetch(`http://localhost:8080/api/orders/${userId}/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
    });

    if (response.status === 200) {
      successMessage("Užsakyta");
    } else {
      errorMessage("Klaida!");
    }

    setForceRender(!forceRender);
    setDisplayOrderModal(false);
  };

  const showOrderDecreaseModal = (userId, id) => {
    setDisplayOrderDecreaseModal(true);
    setUserId(userId);
    setOrderDecreaseId(id);
  };

  const hideOrderDecreaseModal = () => {
    setDisplayOrderDecreaseModal(false);
  };

  
  const showOrderModal = (userId, id) => {
    setDisplayOrderModal(true);
    setUserId(userId);
    setOrderId(id);
  };

  const hideOrderModal = () => {
    setDisplayOrderModal(false);
  };

  const ordersSum = allOrders.reduce((n, { orders }) => n + orders, 0);


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
              <h2>Vartotojai pasirinkę {ordersSum} patiekalus  </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom ">
        <div className="container">
          <div >
            <Accordion defaultActiveKey="0" >
              <Accordion.Item eventKey="0" >
                <Accordion.Header >Koreguokite savo pasirinkimus</Accordion.Header>
                <Accordion.Body >
                  <div className="add">
                    
       
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
                    <th>Vartotojas</th>
                    <th>Restoranas</th>
                    <th>Meniu</th>
                    <th>Pavadinimas</th>
                    <th>Kaina</th>
                    <th>Kiekis</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((order) => {
                    return (

                      <tr key={order.dishId}>
                        <td>{order.userEmail}&nbsp;</td>
                        <td>{order.restaurantName}&nbsp;</td>
                        <td>{order.menuName}&nbsp;</td>
                        <td>{order.dishName}&nbsp;</td>
                        <td>{order.dishPrice}&euro;&nbsp;</td>


                        <td
                        >

                          <button
                            onClick={() => showOrderDecreaseModal(order.userId, order.dishId)}
                            className="btn"
                            type="button"
                            style={{ paddingTop: 0, paddingBottom: 10 }}
                          >
                            <FontAwesomeIcon
                              icon={faCircleMinus}
                              className="add__btn__expense"
                              style={{ width: "20px" }}
                            />
                          </button>

                          {order.orders}

                          <button
                            onClick={() => showOrderModal(order.userId, order.dishId)}
                            className="btn"
                            type="button"
                            style={{ paddingTop: 0, paddingBottom: 10 }}
                          >
                            <FontAwesomeIcon
                              icon={faCirclePlus}
                              className="add__btn__expense"
                              style={{ width: "20px" }}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <OrderDecreaseModal
                  showModal={displayOrderDecreaseModal}
                  hideModal={hideOrderDecreaseModal}
                  confirmModal={removeDish}
                  id={orderDecreaseId}
                />
                <OrderModal
                  showModal={displayOrderModal}
                  hideModal={hideOrderModal}
                  confirmModal={orderDish}
                  id={orderId}
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
