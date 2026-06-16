import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS } from '../queries'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createNewBook] = useMutation(ADD_BOOK, {
    refetchQueries: [
      { query: ALL_AUTHORS },
      { query: ALL_BOOKS, variables: { genre: 'all genres' }},
      { query: ALL_BOOKS },
    ],
  })

  const submit = async (event) => {
    event.preventDefault()
    
    const publishedAsInt = parseInt(published)
    createNewBook({ variables: { title, author, genres, published: publishedAsInt }})

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <label>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
        <br />
        <label>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
        <br />
        <label>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </label>
        <br />
        <label>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </label>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
