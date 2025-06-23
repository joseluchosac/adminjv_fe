import { Col, Container, Row } from "react-bootstrap";
import { NumeracionesProvider } from "./context/NumeracionesContext";
import EstablecimientosLst from "./EstablecimientosLst";
import NumeracionesTbl from "./NumeracionesTbl";
import NumeracionForm from "./NumeracionForm";

export default function Users(){
  return (
    <NumeracionesProvider>
      <Container style={{maxWidth: "991.98px"}}>
        <Row>
          <Col sm={4} xl={3}>
            <EstablecimientosLst />
          </Col>
          <Col sm={8} xl={9}>
            <NumeracionesTbl />
          </Col>
        </Row>
        <NumeracionForm />
      </Container>
    </NumeracionesProvider>
  );
}
