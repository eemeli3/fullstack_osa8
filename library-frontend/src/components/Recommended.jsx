import { useApolloClient, useQuery, useSubscription } from '@apollo/client/react'
import { ALL_BOOKS, GET_USER, BOOK_ADDED } from '../queries'
import { addBookToCache } from '../utils/apolloCache'
import BookTable from './BookTable'

const Recommended = () => {
  const userResult = useQuery(GET_USER)
  const result = useQuery(ALL_BOOKS)
  const client = useApolloClient()

  result.refetch()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      addBookToCache(client.cache, addedBook)
    }
  })

  if (userResult.loading) {
    return <div>loading...</div>
  }
  const genre = userResult.data.me.favoriteGenre
  
  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks.filter((book) => book.genres.includes(genre))

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre <strong>{genre}</strong>
      </div>
      <BookTable books={books} />
    </div>
  )
}

export default Recommended
