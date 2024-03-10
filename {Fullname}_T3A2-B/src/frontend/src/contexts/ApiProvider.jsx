
import { createContext, useState } from "react";

export const ApiContext = createContext();

export function ApiProvider(props) {
  let [apiUrl, setApiUrl] = useState(process.env.REACT_APP_API_URL);

  return (
    <ApiContext.Provider value={{ apiUrl, setApiUrl}}>
      {props.children}
    </ApiContext.Provider>
  );
}