import Header from 'components/Shared/Header'
import Container from 'components/Shared/Container'

const Layout = ({ children }) => {
  return (
    <>
      <Header wide={true} />

      <Container wide={true} className="mt-4 text-center items-start">
        <div className="grow">{children}</div>
      </Container>
    </>
  )
}

export default Layout
