import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css';
import './components/Rules/Rules'
import Rules from './components/Rules/Rules';
import Checklist from './components/checklist/Checklist';

const baseUrl = 'http://localhost:3000/'

function App() {
  const [loginForm, setLoginForm] = useState({})
  const [user, setUser] = useState({ username: '', token: '' })
  const [date, setDate] = useState(new Date)
  useEffect(() => {
    if (localStorage.getItem('token') && localStorage.getItem('username')) {
      let body = { 'token': localStorage.getItem('token') }
      checkLoggedIn(body)
    }
  }, [])

  async function checkLoggedIn(body) {

    let result = await axios.get(baseUrl + 'user/islogedin', { params: { body } })
    if (result.data) {

      setUser({ "username": localStorage.getItem('username'), "token": localStorage.getItem('token') })
    }
    else {
      localStorage.removeItem("token")
      localStorage.removeItem("username")
      setUser({ username: '', token: '' })
    }
  }

  const handleLoginFormChange = (e) => {
    let name = e.target.name
    let value = e.target.value
    setLoginForm({ ...loginForm, [name]: value })
  }
  async function login() {
    let result = await axios.post(baseUrl + 'user/login', loginForm)

    setUser(result.data)
    localStorage.setItem("token", result.data.token)
    localStorage.setItem("username", result.data.username)
  }
  async function logout() {
    let result = await axios.post(baseUrl + 'user/logout', user)

    setUser({ username: '', token: '' })
    localStorage.removeItem("token")
    localStorage.removeItem("username")
  }
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    await login()
    setLoginForm({})
  }
  const handleLogout = async (e) => {
    e.preventDefault()
    await logout()
  }
  return (
    <div className="App">
      <header className="App-header">
        {(user.token === '' || user.token === null) ?
          <div>
            <form onSubmit={handleLoginSubmit}>
              <input type="username" placeholder="UserName" value={loginForm.username || ""} name="username" onChange={handleLoginFormChange} required></input>
              <input type="password" placeholder="Password" value={loginForm.password || ""} name="password" onChange={handleLoginFormChange} required></input>
              <button type="submit">Login</button>
            </form>
          </div>
          :
          <div>
            {date.getFullYear()+":"+date.getMonth()+":"+date.getDate()}
            <button onClick={handleLogout}>
              Logout</button>
              <div>
                <Rules baseUrl={baseUrl}></Rules>
              </div>
              <div>
              <Checklist baseUrl={baseUrl} username = {user.username}></Checklist>
              </div>
          </div>
        }
      </header>
    </div>
  );
}

export default App;
