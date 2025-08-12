import { Col, Container, Row } from "react-bootstrap";
import { NumeracionesProvider } from "../../features/numeraciones/context/NumeracionesContext";
import EstablecimientosLst from "../../features/numeraciones/EstablecimientosLst";
import NumeracionesTbl from "../../features/numeraciones/NumeracionesTbl";
import NumeracionForm from "../../features/numeraciones/NumeracionForm";

export default function NumeracionesPage(){
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
