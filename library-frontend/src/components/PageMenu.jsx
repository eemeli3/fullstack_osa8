import PageButton from "./PageButton"
import Logout from "./Logout"

const PageMenu = ({ setPage, signedIn, setSignedIn }) => {
  const navigationButton = {
    padding: 5
  }

  return (
    <div>
      <PageButton style={navigationButton} name={'authors'} setPage={setPage} />
      <PageButton style={navigationButton} name={'books'} setPage={setPage} />
      {!signedIn && <PageButton style={navigationButton} name={'login'} setPage={setPage} />}
      {signedIn && <PageButton style={navigationButton} name={'add book'} setPage={setPage} />}
      {signedIn && <PageButton style={navigationButton} name={'recommended'} setPage={setPage} />}
      {signedIn && <Logout style={navigationButton} setSignedIn={setSignedIn} />}
    </div>
  )
}

export default PageMenu