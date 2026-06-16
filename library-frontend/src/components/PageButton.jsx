const PageButton = ({ name, setPage, style }) => {
  return (
    <button style={style} onClick={() => setPage(name)}>{name}</button>
  )
}

export default PageButton