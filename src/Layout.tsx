import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div id="Header" className="glass-panel" style={{
        margin: "1rem",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: "1rem",
        zIndex: 1000
      }}>
        <h1 className="text-gradient" style={{ margin: 0, fontSize: "1.8rem", fontWeight: "700" }}>
          CodeLab
        </h1>
        {/* Navigation links could go here in the future */}
      </div>
      <Outlet />
    </>
  )
};

export default Layout;