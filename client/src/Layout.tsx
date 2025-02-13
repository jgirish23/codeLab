import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div id="Header">
        <h1>This is header</h1>
      </div>
      <Outlet />
      {/* <div id="Footer">
        <h1>This is Footer</h1>
      </div> */}
    </>
  )
};

export default Layout;