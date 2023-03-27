import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { useSendLogoutMutation } from "../../features/auth/authApiSlice"


import "../../css/navbarV.css"
import SiteLogo from '../../img/assaultrifle.svg'

const NavbarV = () => {

  const { isManager, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useSendLogoutMutation()

  useEffect(() => {
    if (isSuccess) navigate('/')
  }, [isSuccess, navigate])

  const onLogoutClicked = () => sendLogout()

  if (isLoading) return <p>Logging Out...</p>

  if (isError) return <p>Error: {error.data?.message}</p>

  const logoutButton = (

    <li className="">
      <a href="/#" onClick={onLogoutClicked}>
        <i className='bx bx-log-out icon' ></i>
        <span className="text nav-text">登出</span>
      </a>
    </li>
  )

  let buttonContent
  if (isLoading) {
    buttonContent = <p>Logging Out...</p>
  } else {
    buttonContent = (
      <>
        {logoutButton}
      </>
    )
  }

  const modeSwitchDM = () => {
    const body = document.querySelector('body')
    const modeSwitch = body.querySelector(".toggle-switch")
    const modeText = body.querySelector(".mode-text");

    if (modeSwitch) {
      modeSwitch.addEventListener("click", () => {
        body.classList.toggle("dark");

        if (body) {
          if (body.classList.contains("dark")) {
            modeText.innerText = "燈光模式";
          } else {
            modeText.innerText = "深色模式";

          }
        }
      });
    }
  }

  const setNavBarSize = () => {
    const body = document.querySelector('body')
    const sidebar = body.querySelector('nav')
    const toggle = body.querySelector(".toggle")
    const searchBtn = body.querySelector(".search-box")

    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("close");
    })

    searchBtn.addEventListener("click", () => {
      sidebar.classList.remove("close");
    })
  }

  return (
    <nav className="sidebar close">
      <header>
        <div className="image-text">
          <span className="image">
            <img src={SiteLogo} alt="logo" />
          </span>

          <div className="text header-text">
            <span className="name">Wargame-HK</span>
            <span className="profession">網上約戰平台</span>
          </div>
        </div>

        <i className='bx bx-chevron-right toggle' onClick={setNavBarSize}></i>
      </header>

      <div className="menu-bar">
        <div className="menu">
          <li className="search-box">
            <i className="bx bx-search icon"  ></i>
            <input type="search" placeholder="搜索..."></input>
          </li>
          <ul className="menu-links">

            <li className="nav-link">
              <Link to="/dash">
                <i className='bx bx-home-alt icon' ></i>
                <span className="text nav-text">儀表板</span>
              </Link>
            </li>

            <li className="nav-link">
              <Link to="/dash">
                <i className='bx bx-bell icon' ></i>
                <span className="text nav-text">通知</span>
              </Link>
            </li>

            <li className="nav-link">
              <Link to="/dash/games">
                <i className='bx bx-trophy icon'></i>
                <span className="text nav-text">尋找戰局</span>
              </Link>
            </li>

            <li className="nav-link">
              <a href="/dash">
                <i className='bx bxs-group icon'></i>
                <span className="text nav-text">團隊</span>
              </a>
            </li>

            <li className="nav-link">
            <Link to="/dash/record">
              <i className='bx bx-file icon'></i>
                <span className="text nav-text">射擊記錄</span>
              </Link>
            </li>

            <li className="nav-link">
              <Link to="/dash/timer">
              <i className='bx bx-timer icon' ></i>
                <span className="text nav-text">計時器</span>
              </Link>
            </li>

            {(isManager || isAdmin) &&
              <li className="nav-link">
                <Link to="/dash/users">
                  <i className='bx bxs-user-detail icon'></i>
                  <span className="text nav-text">編輯用戶資料</span>
                </Link>
              </li>
            }

          </ul>
        </div>

        <div className="bottom-content">
          {buttonContent}


          <li className="mode">
            <div className="moon-sun">
              <i className='bx bx-moon icon moon' ></i>
              <i className='bx bx-sun icon sun' ></i>
            </div>
            <span className="mode-text text">深色模式</span>

            <div className="toggle-switch" onClick={modeSwitchDM}>
              <span className="switch"></span>
            </div>
          </li>
        </div>
      </div>
    </nav>
  )
}

export default NavbarV
