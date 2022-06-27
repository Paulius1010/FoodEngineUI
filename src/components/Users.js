import React, { useState, useEffect, useRef } from "react";
import "./IncomeAndExpense.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/auth.service";
import { useForm } from "react-hook-form";
import EditUserModal from "./EditUserModal";
import DeleteModal from "./DeleteModal";
import ReactPaginate from "react-paginate";
import Table from "react-bootstrap/Table";

export default function Users() {
  const [allUsers, setAllUsers] = useState([]);
  const [forceRender, setForceRender] = useState(false);
  const currentUser = AuthService.getCurrentUser();
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onSubmit", reValidateMode: "onSubmit" });
  const [submitResponse, setSubmitResponse] = useState(null);
  const [deleteId, setDeleteId] = useState();
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);

  const password = useRef({});
  password.current = watch("password", "");

  // Add new user to database from the inputs
  const onSubmit = async (data) => {
    let admin = "";

    if (data.admin) {
      admin = "admin";
    }

    const response = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
        role: [admin, "user"],
      }),
    });

    if (response.status === 200) {
      successMessage();
      reset();
    } else if (response.status != 400) {
      errorMessage("Klaida!");
    }

    setSubmitResponse(response.status);
    setForceRender(!forceRender);
  };

  // Popup message configuration
  toast.configure();
  const successMessage = () => {
    toast.success("Vartotojas sukurtas", {
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

  const removeUser = async (id) => {
    await fetch(`http://localhost:8080/api/user/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
    });

    setForceRender(!forceRender);
    setDisplayDeleteModal(false);
  };

  // Fetch all users from database to display down below

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch(`http://localhost:8080/api/user/all`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${currentUser.accessToken}`,
  //       },
  //     });
  //     const data = await response.json();
  //     setAllUsers(data);
  //   };

  //   fetchData();
  // }, [forceRender]);

  const showDeleteModal = (id) => {
    setDisplayDeleteModal(true);
    setDeleteId(id);
  };

  const hideDeleteModal = () => {
    setDisplayDeleteModal(false);
  };

  //for pagination

  const [pageCount, setpageCount] = useState(0);

  let limit = 9;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:8080/api/user/allPage?offset=0&pageSize=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });
      const data = await response.json();
      setAllUsers(data.content);
      const total = data.totalPages;

      setpageCount(total);
    };

    fetchData();
  }, [forceRender]);

  const fetchExpense = async (currentPage) => {
    const res = await fetch(
      `http://localhost:8080/api/user/allPage?offset=${currentPage}&pageSize=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      }
    );
    const data = await res.json();

    return data.content;
  };

  const handlePageClick = async (data) => {


    let currentPage = data.selected;

    const expenseFormServer = await fetchExpense(currentPage);

    setAllUsers(expenseFormServer);
    // scroll to the top
    //window.scrollTo(0, 0)
  };
  return (
    <>
      {/* <div className="bottom mt-4"> */}
      <div className="container-fluid budget__income sticky-config">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2>Pridėti naują vartotoją </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="" >
          {/* <h2 className="">Pridėti naują vartotoją</h2> */}
          <div className="row text-center add__container ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="input-group my-2 justify-content-center"
            >
              <div className="col-2 p-0 pe-2">
                <input
                  {...register("username", {
                    required: true,
                    minLength: 4,
                  })}
                  type="text"
                  className="form-control add__description"
                  placeholder="Vardas"
                />
                {errors?.username?.type === "required" && (
                  <p>Šis laukas yra privalomas</p>
                )}
                {errors?.username?.type === "minLength" && (
                  <p>Vardas turi būti bent 4 simbolių ilgio</p>
                )}
              </div>

              <div className="col-2 p-0 pe-2">
                <input
                  {...register("email", {
                    required: true,
                    minLength: 4,
                  })}
                  type="email"
                  className="form-control add__value"
                  placeholder="El. paštas"
                />
                {errors?.email?.type === "required" && (
                  <p>Šis laukas yra privalomas</p>
                )}
                {errors?.email?.type === "minLength" && (
                  <p>El-paštas turi būti sudarytas iš bent 4 simbolių</p>
                )}
                {submitResponse === 400 && (
                  <p>El. paštas jau yra naudojamas</p>
                )}
              </div>

              <div className="col-2 p-0 pe-2">
                <input
                  {...register("password", {
                    required: true,
                    minLength: 6,
                  })}
                  type="password"
                  className="form-control add__value"
                  placeholder="Slaptažodis"
                />
                {errors?.password?.type === "required" && (
                  <p>Šis laukas yra privalomas</p>
                )}
                {errors?.password?.type === "minLength" && (
                  <p>Slaptažodis turi būti bent 6 simbolių ilgio </p>
                )}
              </div>

              <div className="col-2 p-0">
                <input
                  {...register("password_repeat", {
                    validate: (value) =>
                      value === password.current || "Slaptažodžiai nesutampa",
                  })}
                  type="password"
                  className="form-control"
                  placeholder="Pakartoti slaptažodį"
                />
                {errors.password_repeat && (
                  <p>{errors.password_repeat.message}</p>
                )}
              </div>

              <div className="col-4 p-0">
                <label htmlFor="admin" className="ms-1">
                  Admin.?
                </label>
                <input
                  {...register("admin")}
                  name="admin"
                  type="checkbox"
                  className="ms-1"
                />

                <button className="btn" type="submit">
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    className="add__btn__income"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>


      <div className="container" style={{ paddingRight: 0 }}>
        <div
          className="col-12 username"
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          {/* <h2 className="income__title">Vartotojai</h2> */}
          <div className="container income__list"
            style={{ paddingLeft: 0, paddingRight: 0 }}></div>

          <Table hover>
            <thead>
              <tr>
                <th>Vardas</th>
                <th>El. paštas</th>
                <th>Rolė</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* Display users on the page */}
              {allUsers.map((users) => {
                // Show everyone but currently logged in user
                if (users.id !== currentUser.id) {
                  return (
                    // <div key={users.id}>
                    //   <div className="row">
                    //     <div className="col-3">{users.username}&nbsp;</div>
                    //     <div className="col-4" style={{ paddingLeft: 40 }}>
                    //       {users.email}&nbsp;
                    //     </div>
                    //     <div className="col-3" style={{ paddingLeft: 50 }}>
                    //       {/* {users.roles.map(roles => {
                    //                             return(
                    //                                 <div key={roles.id}>
                    //                                     {roles.name}
                    //                                 </div>
                    //                             )
                    //                         })} */}
                    //       {users.roles.map((roles) => (
                    //         <p>{roles.name}</p>
                    //       ))}
                    //     </div>

                    //     <div
                    //       className="col-2"
                    //       style={{ textAlign: "right", paddingRight: 0 }}
                    //     >
                    //       <EditUserModal
                    //         id={users.id}
                    //         username={users.username}
                    //         email={users.email}
                    //         roles={users.roles}
                    //         forceRender={forceRender}
                    //         setForceRender={setForceRender}
                    //       />

                    //       <button
                    //         // onClick={() => removeUser(users.id)}
                    //         onClick={() => showDeleteModal(users.id)}
                    //         className="btn"
                    //         type="button"
                    //       >
                    //         <FontAwesomeIcon
                    //           icon="trash"
                    //           className="add__btn__income"
                    //           style={{ width: "20px" }}
                    //         />
                    //       </button>
                    //     </div>
                    //   </div>
                    // </div>
                    <tr key={users.id}>

                      <td>{users.username}&nbsp;</td>
                      <td>
                        {users.email}&nbsp;
                      </td>
                      <td>
                        {/* {users.roles.map(roles => {
                                                return(
                                                    <div key={roles.id}>
                                                        {roles.name}
                                                    </div>
                                                )
                                            })} */}
                        {users.roles.map((roles) => (
                          <p>{roles.name}</p>
                        ))}
                      </td>

                      <td
                        className="col-2"
                        style={{ textAlign: "right", paddingRight: 0 }}
                      >
                        <EditUserModal
                          id={users.id}
                          username={users.username}
                          email={users.email}
                          roles={users.roles}
                          forceRender={forceRender}
                          setForceRender={setForceRender}
                        />

                        <button
                          // onClick={() => removeUser(users.id)}
                          onClick={() => showDeleteModal(users.id)}
                          className="btn"
                          type="button"
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
                }
              })}
            </tbody>
            <DeleteModal
              showModal={displayDeleteModal}
              hideModal={hideDeleteModal}
              confirmModal={removeUser}
              id={deleteId}
            />
          </Table>
        </div>

        {/* pagination for the user items */}

        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>

      {/* </div> */}
    </>
  );
}
