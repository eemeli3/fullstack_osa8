import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import { LOGIN } from '../queries'

const LoginForm = ({ setSignedIn }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login ] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      localStorage.setItem('library-user-token', token)
    }
  })

  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    await login({
      variables: {
        username,
        password,
      }
    })
    setSignedIn(true)
    navigate('/')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm