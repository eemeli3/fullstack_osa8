import { useState } from "react"
import { useQuery } from "@apollo/client/react"
import { ALL_BOOKS } from "../queries"

const GenreMenu = ({ setSelectedGenre }) => {
  const [genres, setGenres] = useState([])
  const result = useQuery(ALL_BOOKS)

  if (result.loading) {
    return null
  }
  
  const books = result.data.allBooks

  for (const book of books) {
    for (const genre of book.genres) {
      if (!(genres.includes(genre))) {
        setGenres(genres.concat(genre))
      }
    }
  }

  return (
    <div>
      {genres.map((genre) => <button key={genre} onClick={() => setSelectedGenre(genre)}>{genre}</button>)}
      <button onClick={() => setSelectedGenre('all genres')}>all genres</button>
    </div>
  )
}

export default GenreMenu