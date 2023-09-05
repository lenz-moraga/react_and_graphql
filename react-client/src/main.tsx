import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { Client, Provider, cacheExchange, fetchExchange } from "urql";

// After installing urql we will create an instance of the urql client and wrap our application component with the urql Provider and pass that component the instantiated client.

// The last step will be to query our data in the App.tsx

const client = new Client({
  url: import.meta.env.VITE_API_URL || "http://localhost:4000/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>
);
