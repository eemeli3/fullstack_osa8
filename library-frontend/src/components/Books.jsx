import { useState } from 'react'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client/react'
import { ALL_BOOKS, BOOK_ADDED } from '../queries'
import { addBookToCacheWithGenre } from '../utils/apolloCache'
import GenreMenu from './GenreMenu'
import BookTable from './BookTable'

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState('all genres')

  const result = useQuery(ALL_BOOKS, {
    variables: {
      genre: selectedGenre
    },
  })

  const client = useApolloClient()

  result.refetch() // result needs to be refetches in case query was unmounted when book was added by another user

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      addBookToCacheWithGenre(client.cache, addedBook, selectedGenre)
    }
  })

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>
      <div>
        in genre <strong>{selectedGenre ? selectedGenre : "all genres"}</strong>
      </div>
      <BookTable books={books} />
      <br />
      <GenreMenu setSelectedGenre={setSelectedGenre} />
    </div>
  )
}

export default Books
