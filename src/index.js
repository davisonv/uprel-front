import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import PrivateRoute from "./navigation/PrivateRoute";
import { Login } from "./autenticacao/pages";
import { Dashboard } from "./dashboard/pages";
import { ListaPessoas } from "./modulos/pessoas/pages/ListaPessoas";
import { ListaProdutos } from "./modulos/produtos/pages/ListaProdutos";
import { MainProvider } from "./context/MainContext";
import Dev from "./Dev";
import App from "./App";
import history from "./navigation/history";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ListaUsuarios from "./modulos/usuarios/pages/ListaUsuarios";
import ListaNegocios from "./modulos/negocios/pages/ListaNegocios";
import ListaEmpresas from "./modulos/empresas/pages/ListaEmpresas";
import ListaParceiros from "./modulos/parceiros/pages/ListaParceiros";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/pessoas",
        element: (
          <PrivateRoute>
            <ListaPessoas />
          </PrivateRoute>
        ),
      },
      {
        path: "/empresas",
        element: (
          <PrivateRoute>
            <ListaEmpresas />
          </PrivateRoute>
        ),
      },
      {
        path: "/produtos",
        element: (
          <PrivateRoute>
            <ListaProdutos />
          </PrivateRoute>
        ),
      },
      {
        path: "/usuarios",
        element: (
          <PrivateRoute>
            <ListaUsuarios />
          </PrivateRoute>
        ),
      },
      {
        path: "/negocios",
        element: (
          <PrivateRoute>
            <ListaNegocios />
          </PrivateRoute>
        ),
      },
      {
        path: "/parceiros",
        element: (
          <PrivateRoute>
            <ListaParceiros />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "dev",
    element: <Dev />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MainProvider>
    <RouterProvider router={router} history={history} />
  </MainProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
