import { useRef, useState, useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux"
import { setCredentials } from './authSlice'
import { useLoginMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import "../../css/login.css"

const Login = () => {
  const userRef = useRef()
  const errRef = useRef()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()
  const [iserrormsg, setErrorMsg] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, { isLoading }] = useLoginMutation()

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    setErrMsg('');
    setErrorMsg(false)
  }, [username, password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { accessToken } = await login({ username, password }).unwrap()
      dispatch(setCredentials({ accessToken }))
      setUsername('')
      setPassword('')
      navigate('/dash')
    } catch (err) {
      if (!err.status) {
        setErrMsg('No Server Response');
        setErrorMsg(true)
      } else if (err.status === 400) {
        setErrMsg('Missing Username or Passowrd');
        setErrorMsg(true)
      } else if (err.status === 401) {
        setErrMsg('Username or Password incorrect ');
        setErrorMsg(true)
      } else {
        setErrMsg(err.data?.message);
        setErrorMsg(true)
      }
      errRef.current.focus();
    }
  }

  const handleUserInput = (e) => setUsername(e.target.value)
  const handlePwdInput = (e) => setPassword(e.target.value)
  const handleToggle = () => setPersist(prev => !prev)

  const errClass = errMsg ? "errmsg" : "offscreen"

  if (isLoading) return <p>Loading</p>

  const content = (
    <body className="loginbody">

    <main className="login">


      <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

      <div className="loginform" >
        {
          (iserrormsg) &&
          <div className="alert alert-primary" role="alert">
            {errMsg}
          </div>
        }

        <div className="loginform__i">
          <p className="formtext_logo">WarGame-HK</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Username :</label>
              <input
                className="form-control"
                type="text"
                id="username"
                ref={userRef}
                value={username}
                onChange={handleUserInput}
                autoComplete="off"
                required
              />
              <div id="emailHelp" className="form-text">We'll never share your information with anyone else.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Password :</label>
              <input
                className="form-control"
                type="password"
                id="password"
                onChange={handlePwdInput}
                value={password}
                required
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="persist"
                onChange={handleToggle}
                checked={persist}
              />
              <label className="form-check-label" htmlFor="exampleCheck1">Trust This Device</label>
            </div>
            <button className="btn btn-light">Login</button>
          </form>
          <hr className="line" />
          <Link to="/register"><button className="btn btn-light">Register</button></Link>
        </div>
      </div>
    </main>

    </body>
  )

  return content
}

export default Login
