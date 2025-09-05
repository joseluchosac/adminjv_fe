import "../../../assets/css/header-layout.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import useSessionStore from "../../store/useSessionStore";
import useLayoutStore from "../../store/useLayoutStore";
import DynaIcon from "../DynaComponents";
import { FaDoorOpen } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import { useUserSessionQuery } from "../../../api/queries/useUsersQuery";


function HeaderLayout () {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const layout = useLayoutStore(state => state.layout)
  const setLayout = useLayoutStore(state => state.setLayout)
  const moduloActual = useSessionStore(state => state.moduloActual)
  const navigate = useNavigate()
  const {userSession} = useUserSessionQuery()

  const showSidebar = (e:React.MouseEvent) => {
    e.preventDefault();
    document.body.classList.toggle("sidebar-show-responsive");
  };

  const handleLogout = (e:React.MouseEvent) => {
    e.preventDefault();
    resetSessionStore()
    navigate("/signin")
  };

  const handleMisDatos = (e:React.MouseEvent) => {
    e.preventDefault()
    navigate("/profile")
  }

  const handleHeaderFixed = (e:React.MouseEvent) => {
    e.preventDefault();
    if(layout){
      setLayout({...layout, fixedHeader: !layout.fixedHeader})
    }
  };

  return (
    <Navbar expand="md" className={`main-header ${layout?.fixedHeader ? 'fixed-top' : ''}`} style={{zIndex:"1035"}}>
      <Container fluid>
        <Navbar.Brand href="#" className="toggle-sidebar" onClick={showSidebar}>
          <DynaIcon name="FaBars" />
        </Navbar.Brand>
        <div className="fs-5 ms-2">{moduloActual?.descripcion.toUpperCase()}</div>
        <Navbar.Toggle aria-controls="navbarScroll">
          <DynaIcon name="FaSortDown" className="mb-2" />
        </Navbar.Toggle>
        <Navbar.Collapse style={{flexGrow:"0"}} id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Link to="/home" className="nav-link">Inicio</Link>
            <Link to="/users" className="nav-link">Usuarios</Link>
          </Nav>
          <Nav>
            <NavDropdown
              className={`dropdown-header ${!userSession ? 'd-none' : ''}`}
              align='end'
              title={
                <div className="d-flex align-items-center gap-2">
                  <DynaIcon name="FaUser" />
                  <span>{userSession?.username}</span>
                </div>
              }
            >
              <NavDropdown.Item href="#" onClick={handleMisDatos} className="d-flex align-items-center gap-2">
                <FaUserEdit /> <span>Mi perfil</span>
              </NavDropdown.Item>
              <NavDropdown.Item href="" onClick={handleLogout} className="d-flex align-items-center gap-2">
                <FaDoorOpen /> <span>Cerrar sesión</span>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#" onClick={handleHeaderFixed}>
                {layout?.fixedHeader ? 'Movilizar cabecera' : 'Fijar cabecera'}
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>


        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
};

export default HeaderLayout;
