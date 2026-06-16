import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { SET_BORN, ALL_AUTHORS } from '../queries'

const BirthyearForm = (props) => {
  const [name, setName] = useState('name')
  const [born, setBorn] = useState('')
  const [updateAuthor] = useMutation(SET_BORN, {
      refetchQueries: [
        { query: ALL_AUTHORS }
      ],
    })

  const submit = async (event) => {
    event.preventDefault()
    const setBornTo = parseInt(born)
    updateAuthor({ variables: { name, setBornTo }})
    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <label>
            name
            <select
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
            >
              {props.authors.map(author => {
                return (
                  <option value={author.name} key={author.id}>
                    {author.name}
                  </option>
                )
              })}
            </select>
          </label>
        </div>
        <label>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </label>
        <br />
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default BirthyearForm
