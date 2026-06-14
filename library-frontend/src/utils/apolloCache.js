import { ALL_BOOKS } from '../queries'

export const addBookToCache = (cache, bookToAdd) => {
  cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
    const bookExists = allBooks.some(
      (book) => book.id === bookToAdd.id,
    )

    if (bookExists) {
      return { allBooks }
    }

    return {
      allBooks: allBooks.concat(bookToAdd),
    }
  })
}

export const addBookToCacheWithGenre = (cache, bookToAdd, genre) => {
  cache.updateQuery({ query: ALL_BOOKS, variables: { genre: genre } }, ({ allBooks }) => {
    const bookExists = allBooks.some(
      (book) => book.id === bookToAdd.id,
    )

    if (bookExists) {
      return { allBooks }
    }

    if (genre === 'all genres') {
      return {
        allBooks: allBooks.concat(bookToAdd),
      }
    }

    if (bookToAdd.genres.includes(genre)) {
      return {
        allBooks: allBooks.concat(bookToAdd),
      }
    }

    return { allBooks }
  })
}