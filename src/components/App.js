import React from "react"
import Signup from "./Signup"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { AuthProvider, useAuth } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route, useHistory } from "react-router-dom"
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import Programs from "./Programs"
import SingleProgram from "./SIngleProgram"
import SingleTrack from "./SingleTrack"

function App() {
  return (
        <Router>
          <AuthProvider>
            <Switch>
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/forgot-password" component={ForgotPassword} />
              <Route component={DefaultContainer} />
            </Switch>
          </AuthProvider>
        </Router>
  )
}

function DefaultContainer() {
  const { logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    try {
      await logout()
      history.push("/login")
    } catch {
      history.push("/login")
    }
  }
  return (<>
    <Navbar expand="lg" bg="primary" variant="dark" fixed="top">
      <Container>
      <Navbar.Brand href="/">Hashedin University</Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/program">Programs</Nav.Link>
        <Nav.Link href="/allocations">Allocations</Nav.Link>
        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
      </Nav>
      </Container>
    </Navbar>
    <PrivateRoute exact path="/" component={Dashboard} />
    <PrivateRoute exact path="/program" component={Programs} />
    <PrivateRoute exact path="/program/:programId" component={SingleProgram} />
    <PrivateRoute exact path="/program/:programId/track/:trackId" component={SingleTrack} />
  </>);
}

export default App


// https://hu-portal-qm2sv2qmx-vraghuvanshi-deloittecom.vercel.app/