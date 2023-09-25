// import { useContext } from "react";
import Link from "next/link";
import { UserContext } from "../context/AuthContext";

export const AuthCheck = (props) => {
  const { user, userName } = useContext(UserContext);

  return userName
    ? props.children
    : props.fallback || <Link href="/login">Sign in first</Link>;
};
