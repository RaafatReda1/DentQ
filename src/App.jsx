import "./App.css";
import Client from "./components/Client/Client";
import Admin from "./components/Admin/Admin";
import GoogleBtn from "./components/Auth/GoogleBtn/GoogleBtn";
import { Route, Routes } from "react-router-dom";
import useUserData from "./components/Storage/UserDataStorage.jsx";
import useProductsData from "./components/Storage/ProductsDataStorage.jsx";
// eslint-disable-next-line no-unused-vars
import { userContext, productsContext } from "./utils/AppContexts";
import { Toaster } from "react-hot-toast";
function App() {
  const { user, setUser } = useUserData(); //I've stored the User state into UserDataStorag.jsx to arrange the code and not to make the code in app.jsx more complex and all states will compelete as this
  const { products, setProducts } = useProductsData();

  return (
    <userContext.Provider value={[user, setUser]}>
      <productsContext.Provider value={[products, setProducts]}>
        <Toaster position="top-center" reverseOrder={false} />

        <Routes>
          {!user.loadingState && (
            <>
              {(user.type === "client" || user.type === "guest") && (
                <Route path="*" element={<Client />} />
              )}
              {user.type === "admin" && <Route path="*" element={<Admin />} />}
            </>
          )}
        </Routes>
        <GoogleBtn />
      </productsContext.Provider>
    </userContext.Provider>
  );
}

export default App;
