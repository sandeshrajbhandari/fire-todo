import React from "react";
import { useContext } from "react";
import { UserContext } from "../context/AuthContext";

export const Header = () => {
  const { user, userName } = useContext(UserContext);
  return <div>Header</div>;
};
