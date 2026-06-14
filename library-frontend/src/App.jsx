import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Logout from './components/Logout'
import Recommended from './components/Recommended'
import { useSubscription } from '@apollo/client/react'
import { BOOK_ADDED } from './queries'

const App = () => {
  const [ signedIn, setSignedIn ] = useState(localStorage.getItem('library-user-token') ? true : false)

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} by ${addedBook.author.name} added`)
    }
  })

  const navigationButton = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <div>
          <Link style={navigationButton} to='/'>authors</Link>
          <Link style={navigationButton} to='/books'>books</Link>
          {!signedIn && <Link style={navigationButton} to='/login'>login</Link>}
          {signedIn && <Link style={navigationButton} to='/add'>add book</Link>}
          {signedIn && <Link style={navigationButton} to='/recommended'>recommend</Link>}
          {signedIn && <Logout style={navigationButton} setSignedIn={setSignedIn} />}
        </div>

        <Routes>
          <Route path='/add' element={<NewBook />} />
          <Route path='/recommended' element={<Recommended />} />
          <Route path='/books' element={<Books />} />
          <Route path='/' element={<Authors />} />
          <Route path='/login' element={<LoginForm setSignedIn={setSignedIn} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
