import { useState } from 'react'
import PageMenu from './components/PageMenu'
import Notification from './components/Notification'
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
  const [ page, setPage ] = useState('authors')
  const [ message, setMessage ] = useState(null)

  const notify = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(null), 5000)
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} by ${addedBook.author.name} added`)
    }
  })

  return (
    <div>
      <PageMenu setPage={setPage} signedIn={signedIn} setSignedIn={setSignedIn} />
      {message && <Notification message={message} />}
      {(page === 'authors') && <Authors signedIn={signedIn} />}
      {(page === 'books') && <Books />}
      {(page === 'login') && <LoginForm setSignedIn={setSignedIn} setPage={setPage} notify={notify} />}
      {(page === 'add book') && <NewBook />}
      {(page === 'recommended') && <Recommended />}
    </div>
  )
}

export default App
