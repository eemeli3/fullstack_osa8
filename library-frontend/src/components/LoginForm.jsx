import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const LoginForm = ({ setSignedIn, setPage, notify }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login ] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      localStorage.setItem('library-user-token', token)
    },
    onError: () => {
      notify(`login failed`)
    }
  })

  const submit = async (event) => {
    event.preventDefault()
    await login({
      variables: {
        username,
        password,
      }
    })
    setSignedIn(true)
    setPage('authors')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <label>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <br />
        <label>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <br />
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm