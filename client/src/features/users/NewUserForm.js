import { faSave } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ROLES } from "../../config/roles"
import { useAddNewUserMutation } from "./userApiSlice"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const EMAIL_REGEX = /^[A-z0-9.@]{6,35}$/
const PHONE_REGEX = /^[0-9]{8}$/



const NewUserForm = () => {

  const [addNewUser, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewUserMutation()

  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [validUsername, setValidUsername] = useState(false)
  const [password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [phone, setPhone] = useState('')
  const [validPhone, setValidPhone] = useState(false)
  const [roles, SetRoles] = useState(["Member"])

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
    if (isSuccess) {
      setUsername('')
      setPassword('')
      SetRoles([])
      navigate('/dash/users')
    }
  }, [isSuccess, navigate])

  const onUsernameChanged = e => setUsername(e.target.value)
  const onPasswordChanged = e => setPassword(e.target.value)
  const onEmailChanged = e => setEmail(e.target.value)
  const onPhoneChanged = e => setPhone(e.target.value)


  const onRolesChanged = e => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    )

    SetRoles(values)
  }

  const canSave = [roles.length, validUsername, validPassword, validEmail, validPhone].every(Boolean) && !isLoading

  const onSaveUserClicked = async (e) => {
    e.preventDefault()
    if (canSave) {
      await addNewUser({ username, password, email, phone, roles })
    }
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

  const errClass = isError ? "errmsg" : "offscreen"

  const content = (
    <>
      <div className="Userlist__Title">
        <p className={errClass}>{error?.data?.message}</p>
        <p><Link to="/dash">儀表板</Link> {'>'} <Link to="/dash/users">用戶名單</Link>  {'>'}  新增用戶</p>
        <div className="New_User_From">
          <form className="form__title-row" onSubmit={onSaveUserClicked}>
            <h2>New User</h2>
            <div className="form_action-buttton">
              <button
                className="icon-button"
                title="Save"
                disabled={!canSave}
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
            </div>


            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username : </label>
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
              <label htmlFor="email" className="form-label">Email: </label>
              <input
                className="form-control"
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                value={email}
                onChange={onEmailChanged}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone: </label>
              <input
                className="form-control"
                id="phone"
                name="phone"
                type="text"
                autoComplete="off"
                value={phone}
                onChange={onPhoneChanged}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password: </label>
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
              <label htmlFor="roles" className="form-label">ASSIGEND ROLES : </label>
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

          </form>
        </div>
      </div>
    </>
  )

  return content
}

export default NewUserForm

