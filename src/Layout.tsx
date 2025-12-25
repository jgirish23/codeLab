import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div id="Header">
        <h1 style={{margin: "1rem 0 0 1rem", color: "rgb(146, 129, 104)"}}>CodeLab</h1>
      </div>
      <Outlet />
      {/* <div id="Footer">
        <h1>This is Footer</h1>
      </div> */}
    </>
  )
};

export default Layout;