import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Layout from "./components/layout";
import Login from "./routes/login";
import CreateAccount from "./routes/createAccount";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import React, { useState, useEffect } from "react";
import LoadingScreen from "./components/loading-screen";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/createAccount",
    element: <CreateAccount />,
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};

  * {
    box-sizing : border-box;
  }
  
  body {
    background-color: black;
    color:white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    setIsLoading(false);
  };
  useEffect(() => {
    // init();
  }, []);

  return (
    <>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </>
  );
}

export default App;
