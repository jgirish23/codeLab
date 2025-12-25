import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout  from "./Layout";
import { Home } from "./pages/home/Home";
import {Code} from "./pages/code/Code"

// Create a router instance with the defined route types.
export const Router = ()=> {
    return(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/codelab" element={<Code />} />
           
          </Route>
        </Routes>
      </BrowserRouter>
    );
}
