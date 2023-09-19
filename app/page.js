"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  // lets add state to our component
  const [todos, setTodos] = useState([{ text: "Learn Next.js", done: false }]);
  // lets add a function to handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // lets get the value of the input
    const todo = e.target.todo.value;
    // lets add the todo to our state
    const done = e.target.done.checked;
    setTodos([...todos, { text: todo, done: done }]);
    e.target.todo.value = "";
    e.target.done.checked = false;
  };

  // add delete functionality.
  // when the user clicks on the delete button, we will remove the todo from the state.
  function deleteTask(index) {
    const updatedTodo = todos.filter((_, i) => i !== index);
    setTodos(updatedTodo);
  }
  return (
    <main className="flex min-h-screen flex-col">
      <header className="p-4 text-center">
        <h2 className="text-3xl font-bold">Fire - ToDo 🔥</h2>
      </header>

      <div className="flex flex-col w-max mx-auto p-2 items-center border border-slate-800">
        <section className="flex w-full justify-center p-4 bg-gray-200 rounded">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 ">
            <div>
              <labelFor htmlFor="todo">Todo item : </labelFor>
              <input
                type="text"
                name="todo"
                required
                className="rounded border p-2"
              />
            </div>
            <div className="flex flex-start">
              <labelFor htmlFor="done">Done : </labelFor>
              <input
                className="text-lg p-4 ml-9 form-checkbox h-5 w-5"
                type="checkbox"
                name="done"
              />
            </div>

            <button className="p-4 bg-green-500 rounded-md" type="submit">
              Add
            </button>
          </form>
        </section>
        {/* TODO LIST display */}
        <section className="w-full">
          <h1 className="text-3xl font-bold underline m-2">Todo List</h1>
          {/* Display todo items here. */}
          {todos.map((todo, index) => (
            <div
              className="flex w-full justify-between p-4 bg-emerald-400 my-2"
              key={index}
            >
              <p>{todo.text}</p>
              <p>{todo.done ? "✅" : "❌"}</p>
              <button
                className="bg-red-600 p-2"
                onClick={() => deleteTask(index)}
              >
                Del
              </button>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
