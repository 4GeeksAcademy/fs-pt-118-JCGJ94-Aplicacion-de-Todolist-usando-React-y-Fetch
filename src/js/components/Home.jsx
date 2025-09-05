import React from "react";
import TodoList from "./TodoList.jsx";
//include images into your bundle

//create your first component
const Home = () => {
  return (
    <>
      <div className=" container text-center">
        <TodoList />
      </div>
    </>
  );
};

export default Home;
