/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./App.css";
import UserTypeRouter from "./utils/UserTypeRouter";
// eslint-disable-next-line no-unused-vars
import { userContext } from "./utils/AppContexts";
import Client from "./components/Client/Client";
import Admin from "./components/Admin/Admin";
import GoogleBtn from "./components/Auth/GoogleBtn/GoogleBtn"
import { Route, Routes } from "react-router-dom";
function App() {
  const [user, setUser] = useState({
    type: "",
    fullName: "",
    nickName: "",
    session: false,
    email: "",
    avatarUrl: "",
    phone: "",
    address: "",
    loadingState: true,
  });

  useEffect(() => {
    UserTypeRouter(user, setUser);
    console.log("userData is:", user);
  }, []); //this function cheks auth state changes
  return (
    <userContext.Provider value={[user, setUser]}>
      <Routes>
        {!user.loadingState && (
          <>
            {(user.type === "client" || user.type === "guest") && (
              <Route path="/" element={<Client />} />
            )}

            {user.type === "admin" && <Route path="/" element={<Admin />} />}
          </>
        )}
      </Routes>
            <GoogleBtn/>

    </userContext.Provider>
  );
}

export default App;
