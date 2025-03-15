import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { store } from "./store/store.js";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App.jsx";

import Home from "./pages/home/Home.jsx";
import Login from "./pages/authentication/Login.jsx";
import Signup from "./pages/authentication/Signup.jsx";
import Signup2 from "./pages/authentication/Signup2.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import UnprotectedRoutes from "./components/UnprotectedRoutes.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <Home />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/login",
    element: (
      <UnprotectedRoutes>
        <Login />
      </UnprotectedRoutes>
    ),
  },
  {
    path: "signup",
    element: (
      <UnprotectedRoutes>
        <Signup />
      </UnprotectedRoutes>
    ),
  },
  {
    path: "*",
    element: "ERROR | PAGE NOT FOUND",
  },
  {
    path: "/signup2",
    element: <Signup2 />,
  },
]);
createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <App />
      <RouterProvider router={router} />
    </Provider>
  </>
);
