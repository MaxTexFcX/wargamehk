import { Outlet } from "react-router-dom"
import DashFooter from "./DashFooter"
import "../css/navbarV.css"
import NavbarV from "../features/auth/Navbar-V"



const DashLayout = () => {
  return (
    <>
      <NavbarV />

      <section className="home">
        <div className="text">
          <Outlet />
        </div>
      </section>

      <div className="DashFooter">
        <DashFooter />
      </div>
    </>
  )
}

export default DashLayout
