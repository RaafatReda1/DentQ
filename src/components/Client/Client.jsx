import React, { useContext } from "react";
import { userContext } from "../../utils/AppContexts";
import Header from "./ClientHeader/Header/Header";

const Client = () => {
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useContext(userContext);
  return (
    <>
      <Header/>
      <h1>Client</h1>
      <h2>{user.fullName}</h2>
      <h2>{user.nickName}</h2>
      <h2>{user.email}</h2>
      <h2>{user.phone}</h2>
      <h2>{user.address}</h2>
    </>
  );
};

export default Client;
