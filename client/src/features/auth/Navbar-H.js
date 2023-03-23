import SiteLogo from '../../img/assaultrifle.svg'
import "../../css/navbarH.css"
import useAuth from '../../hooks/useAuth'

const NavbarH = () => {
    const { isAdmin } = useAuth()

    return (
        <div className="nvbar">
        <header>
            <a className="logotext" href='/dash'><img className="logo" src={SiteLogo} alt="logo" /> Wargame-HK </a>
            <nav>
                <ul className="nav__links">
                    <li className="nav__text"><a href="/">關於我們</a></li>
                    <li className="nav__text"><a href="/">如何使用</a></li>
                    <li className="nav__text"><a href="/">聯絡我們</a></li>
                </ul>
            </nav>
            {(isAdmin) && <a className="cta" href="/login"><button>登出</button></a>}
            
        </header>
        </div>
    )
}

export default NavbarH
