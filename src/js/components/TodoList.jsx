import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserXmark } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const TodoList = () => {
  //definimos estados
  const [tasks, setTasks] = useState([]);
  const [newTasks, setNewTasks] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // variables
  const user = "PepitoMedusa";
  const theHappyWorker =
    tasks?.length === 0 ? "I don't have work !!!" : "Really!! I have to work ?";

  //conectamos con base de datos useEffect-->onload
  useEffect(() => {
    getTodo();
  }, []);

  // se despira useEffect al eliminar usuario
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000); // 5 segundos
      return () => clearTimeout(timer); // limpio el timer
    }
  }, [message]);

  // funciones
  const newUser = () => {
    fetch("https://playground.4geeks.com/todo/users/" + user, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        /*  console.log("Respuesta peticion de crear usuario :", resp); */
        if (!resp.ok) throw new Error("failed user");
        /* return getTodo(); //aqui pasamos la funcion para traer la info del usuario existent */
        return resp.json();
      })
      .then((data) => {
        console.log("data de userCreado 1:", data);
      })
      .catch((error) => console.log("Error user:", error));
    setLoading(false);
  };

  //funcion get
  const getTodo = () => {
    setLoading(true);
    fetch("https://playground.4geeks.com/todo/users/" + user,)
      .then((resp) => {
        if (!resp.ok) throw new Error("user has no tasks.");
        return resp.json();
      })
      .then((data) => {
        setTasks(data.todos);
        setLoading(false);
      })
      .catch((error) => newUser());
  };

  //funcion para manejar el submit del formulario
  const handleNewTodo = (e) => {
    e.preventDefault();
    setNewTasks("");
    if (!newTasks.trim()) {
      return alert("❌ You cannot add empty tasks");
    }
    setLoading(true);
    fetch("https://playground.4geeks.com/todo/todos/" + user, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label: newTasks.trim(),
        is_done: false,
      }),
    })
      .then((resp) => {
        console.log(`${resp.status} ${resp.statusText}`);
        if (!resp.ok) throw new Error("Error creating tasks");
        setLoading(false);
        return getTodo();
      })
      .then((data) => data)
      .catch((error) => console.log(error));
  };

  const deleteTask = (id) => {
    fetch("https://playground.4geeks.com/todo/todos/" + id, {
      method: "DELETE",
    })
      .then((resp) => getTodo())
      .catch((error) => console.log(error));
  };
  // extra para eliminar el usuario ponemos en accion funcion async
  const deleteUser = async () => {
    try {
      setLoading(true);
      const resp = await fetch(
        "https://playground.4geeks.com/todo/users/" + user,
        {
          method: "DELETE",
        }
      );
      if (!resp.ok) throw new Error("Not delete User" + resp.status);
      console.log("Usuario eliminado:");
      setMessage(`✅ UserName "${user}"is done, refresh the page twice`);
      setTasks([]);
    } catch (error) {
      console.log(error);
      setMessage("❌ Error al eliminar el usuario");
    } finally {
      // aqui me aseguro que siempre se quite el loading
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-end gap-2 mt-5 w-100">
        <p className="align-content-center"> {theHappyWorker} </p>
        <img
          className="comic"
          src={
            tasks?.length === 0
              ? "./src/img/dibujo 1.png"
              : "./src/img/dibujo 2.png"
          }
        />
      </div>
      <div className="card text-center mx-auto todo">
        <div className="d-flex">
          <button
            className="delete btn btn-ligth p-2 m-2"
            onClick={() => deleteUser(user)}
            title="You want to delete the user?"
          >
            <div className="icon-delete">
              <FontAwesomeIcon
                className="fs-1 text-dark text-center"
                icon={faUserXmark}
              />
            </div>
          </button>
          {message && <div className="alert alert-info">{message}</div>}
        </div>
        <div className="text-center d-flex justify-content-around">
          <p className="title"> Todo List </p>
        </div>
        <form
          onSubmit={handleNewTodo}
          className="d-flex gap-2 mx-auto p-2 d-block w-50"
        >
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control text-primary p-2 w-75"
              value={newTasks}
              onChange={(e) => setNewTasks(e.target.value)}
              aria-label="new to-do"
              placeholder="new tasks !!!"
              aria-describedby="submit"
            />
            <button
              className="btn btn-outline-info px-3"
              type="submit"
              id="submit"
            >
              {loading ? (
                <span className="spinner-border" role="status"></span>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </form>

        <ul className="list-group gap-2 d-flex list-group rounded w-50 mx-auto mb-3">
          {/* map para crear nuevas tareas, utilizamos clases css para el efecto hover li-button */}
          {tasks?.map((el) => (
            <li
              className="list-group-item text-primary p-auto shadow task-item"
              key={el.id}
            >
              {el.label}
              <button
                className="btn btn-danger btn-sm float-end delete-btn "
                onClick={() => deleteTask(el.id)}
              >
                <FontAwesomeIcon icon={faTrash} className="fs-4" />
              </button>
            </li>
          ))}
        </ul>
        <p className="text-start fw-bold text-light my-2 ms-3">
          {tasks?.length === 0
            ? "There are no tasks"
            : `${tasks.length} item left`}
        </p>
      </div>
    </>
  );
};
export default TodoList;
