import { useState, useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./userApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { ROLES } from "../../config/roles";

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const EMAIL_REGEX = /^[A-z0-9.@]{6,35}$/
const PHONE_REGEX = /^[0-9]{8}$/

const EditUserForm = ({ user }) => {

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(user.roles)
    const [email, setEmail] = useState(user.email)
    const [validEmail, setValidEmail] = useState(false)
    const [phone, setPhone] = useState(user.phone)
    const [validPhone, setValidPhone] = useState(false)
    const [active, setActive] = useState(user.active)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email])

    useEffect(() => {
        setValidPhone(PHONE_REGEX.test(phone))
    }, [phone])

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)
    const onPhoneChanged = e => setPhone(e.target.value)

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )

        setRoles(values)
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}
            >
                {role}
            </option>
        )
    })

    const onActiveChanged = () => setActive(prev => !prev)

    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({ id: user.id, username, email, phone, password, roles, active })
        } else {
            await updateUser({ id: user.id, username, email, phone, roles, active })
        }
    }

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    let canSave
    if (password) {
        canSave = [roles.length, validUsername, validPassword, validEmail, validPhone].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    //const validUserClass = !validUsername ? 'form_input--incomplete' : ''
    //const validPwdClass = !validPassword ? 'form_input--incomplete' : ''
    //const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''



    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveUserClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteUserClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Username : </label>
                    <input
                        className="form-control"
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="off"
                        value={username}
                        onChange={onUsernameChanged}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email :</label>
                    <input
                        className="form-control"
                        type="email"
                        id="email"
                        value={email}
                        onChange={onEmailChanged}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number :</label>
                    <input
                        className="form-control"
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={onPhoneChanged}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password :</label>
                    <input
                        className="form-control"
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={onPasswordChanged}
                    />
                </div>

                <div className="mb-3">
                <label className="form__label" htmlFor="roles">
                    ASSIGEND ROLES:</label>
                <select
                    id="roles"
                    name="roles"
                    className="form-control"
                    multiple={true}
                    size="5"
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="user-active" className="form-label">ACTIVE : </label>
                    <input
                        className="form_checkbox"
                        id="user-active"
                        name="user-active"
                        type="checkbox"
                        checked={active}
                        onChange={onActiveChanged}
                    />
                </div>

            </form>
        </>

    )
    return content

}

export default EditUserForm