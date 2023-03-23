import { useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrinTongueSquint } from '@fortawesome/free-regular-svg-icons'
import { useNavigate, Link, useLocation } from "react-router-dom"

import { useSendLogoutMutation } from "../features/auth/authApiSlice"


const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/


const DashHeader = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if(isSuccess) navigate('/')
    }, [isSuccess, navigate])

    //const onNewNoteClicked = () => navigate('/dash/notes/new')
    //const onNewUserClicked = () => navigate('/dash/user/new')
    //const onNotesClicked = () => navigate('/dash/notes')
    //const onUsersClicked = () => navigate('/dash/users')

    const onLogoutClicked = () => sendLogout()

    if (isLoading) return <p>Logging Out...</p>

    if (isError) return <p>Error: {error.data?.message}</p>


    let dashClass = null
    if(!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        dashClass = "dash-header__container--small"
    }

    //let newNoteButton = null
    //if (NOTES_REGEX.test(pathname)) {
    //    newNoteButton = (
    //        <button
    //        className="icon-button"
    //        title="New Note"
    //        onClick={onNewNoteClicked}
    //        >
    //            <FontAwesomeIcon icon={faFileCirclePlus} />
    //        </button>
    //    )
    //}

    const logoutButton = (
        <button
            className="icon-button"
            title="Logout"
            onClick={onLogoutClicked}
        >
            <FontAwesomeIcon icon={faGrinTongueSquint} />  
        </button>
    )
    
    const errClass = isError ? "errmsg" : "offscreen"

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

    const content = (
        <>
        <p className={errClass}>{error?.data?.message}</p>
        
        <header className="dash-header">
            <div className={`dash-header_container ${dashClass}`}>
                <Link to="/dash">
                    <h1 className="dash-header_title">MaxTexNote</h1>
                </Link>
                <nav className="dash-header__nav">
                    {/* add more buttons later */}
                    {buttonContent}
                </nav>
            </div>
        </header>
        </>
    )

    return content
}

export default DashHeader
