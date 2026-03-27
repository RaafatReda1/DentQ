import React, { useContext } from "react";
import { userContext } from "../../utils/AppContexts";
import GoogleBtn from "../Auth/GoogleBtn/GoogleBtn";
import SignOutBtn from "../Auth/SignOutBtn/SignOutBtn";
const Admin = () => {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useContext(userContext);

  return (
    <>
      <h1>Admin</h1>
      <GoogleBtn />
      <SignOutBtn />
    </>
  );
};

export default Admin;
