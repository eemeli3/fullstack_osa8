import { useApolloClient, useQuery } from "@apollo/client/react"
import { GET_USER } from "../queries"

const Logout = ({ setSignedIn }) => {
  const client = useApolloClient()
  const result = useQuery(GET_USER)

  const logout = () => {
    setSignedIn(false)
    localStorage.clear()
    client.clearStore()
  }

  if (result.loading) {
    return null
  }

  return (
    <span>
      {result.data.me.username} logged in <button onClick={logout}>logout</button>
    </span>
  )
}

export default Logout