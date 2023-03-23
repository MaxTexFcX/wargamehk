import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAddNewUserMutation } from "./userApiSlice"
import { Link } from "react-router-dom"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const EMAIL_REGEX = /^[A-z0-9.@]{6,35}$/
const PHONE_REGEX = /^[0-9]{8}$/

const Register = () => {

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
  const [cfpassword, setCFPassword] = useState('')
  const [validCFpassword, setValidCFpassword] = useState(false)
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
    setValidCFpassword(password === cfpassword)
  }, [password, cfpassword])

  useEffect(() => {
    if (isSuccess) {
      setUsername('')
      setPassword('')
      SetRoles([])
      navigate('/')
    }
  }, [isSuccess, navigate])

  const onUsernameChanged = e => setUsername(e.target.value)
  const onPasswordChanged = e => setPassword(e.target.value)
  const onEmailChanged = e => setEmail(e.target.value)
  const onPhoneChanged = e => setPhone(e.target.value)
  const onCFPasswordChanged = e => setCFPassword(e.target.value)


//  const onRolesChanged = e => {
//    const values = Array.from(
//      e.target.selectedOptions,
//      (option) => option.value
//    )
//
//    SetRoles(values)
//  }

  const canSave = [roles.length, validUsername, validPassword, validEmail, validPhone, validCFpassword].every(Boolean) && !isLoading

  const onSaveUserClicked = async (e) => {
    e.preventDefault()
    if (canSave) {
      await addNewUser({ username, password, email, phone, roles, cfpassword})
    }
  }

 //const options = Object.values(ROLES).map(role => {
 //  return (
 //    <option
 //      key={role}
 //      value={role}
 //    >
 //      {role}
 //    </option>
 //  )
 //})

  //const errClass = isError ? "errmsg" : "offscreen"

  return (
<body className="loginbody">

<main className="login">

  <div className="registerform" >
    {
      (isError) &&
      <div className="alert alert-primary" role="alert">
        {error?.data?.message}
      </div>
    }

    <div className="loginform__i">
      <p className="formtext_logo">WarGame-HK</p>
      <form onSubmit={onSaveUserClicked}>

        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Username :</label>
          <input
            className="form-control"
            type="text"
            id="username"
            value={username}
            onChange={onUsernameChanged}
            autoComplete="off"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Email :</label>
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
          <label htmlFor="exampleInputEmail1" className="form-label">Phone Number :</label>
          <input
            className="form-control"
            type="text"
            id="username"
            value={phone}
            onChange={onPhoneChanged}
            autoComplete="off"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Password :</label>
          <input
            className="form-control"
            type="password"
            id="username"
            value={password}
            onChange={onPasswordChanged}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Confirm Password :</label>
          <input
            className="form-control"
            type="password"
            id="username"
            value={cfpassword}
            onChange={onCFPasswordChanged}
            required
          />
        </div>
        <button 
        className="btn btn-light"
        disabled={!canSave}
        >Register</button>
      </form>
      <hr className="line" />
      <Link to="/login"><button className="btn btn-light">Login</button></Link>
    </div>
  </div>
</main>

</body>

    
  )
}

export default Register



