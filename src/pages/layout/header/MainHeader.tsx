import "./MainHeader.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import useSessionStore from "../../../core/store/useSessionStore";
import useLayoutStore from "../../../core/store/useLayoutStore";
import DynaIcon from "../../../core/components/DynaComponents";
import { FaDoorOpen } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";


function MainHeader () {
  const resetSessionStore = useSessionStore(state => state.resetSessionStore)
  const userSession = useSessionStore(state => state.userSession)
  const layout = useLayoutStore(state => state.layout)
  const setLayout = useLayoutStore(state => state.setLayout)
  const moduloActual = useSessionStore(state => state.moduloActual)
  const navigate = useNavigate()


  const showSidebar = (e:React.MouseEvent) => {
    e.preventDefault();
    document.body.classList.toggle("sidebar-show-responsive");
  };

  const handleLogout = (e:React.MouseEvent) => {
    e.preventDefault();
    resetSessionStore()
    navigate("/auth")
  };

  const handleMisDatos = (e:React.MouseEvent) => {
    e.preventDefault()
    navigate("/user")
  }

  const handleHeaderFixed = (e:React.MouseEvent) => {
    e.preventDefault();
    if(layout){
      setLayout({...layout, fixedHeader: !layout.fixedHeader})
    }
  };

  return (
    <Navbar expand="md" className={`main-header ${layout?.fixedHeader ? 'fixed-top' : ''}`}>
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
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/ventas" className="nav-link">venta</Link>
          </Nav>
          <Nav>
            <NavDropdown
              className="dropdown-header"
              align='end'
              title={
                <div className="d-flex align-items-center gap-2">
                  <DynaIcon name="FaUser" />
                  <span>{userSession?.username}</span>
                </div>
              }
              style={{zIndex:"1035"}}
            >
              <NavDropdown.Item href="#" onClick={handleMisDatos} className="d-flex align-items-center gap-2">
                <FaUserEdit /> <span>Mis datos</span>
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

export default MainHeader;
