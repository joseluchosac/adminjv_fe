import { Col, Container, Row } from "react-bootstrap";
import { SeriesProvider } from "./context/SeriesContext";
import SeriesSucursalTbl from "./SeriesSucursalTbl";
import SucursalesLst from "./SucursalesLst";
import SerieSucursalForm from "./SerieSucursalForm";

export default function Users(){
  return (
    <SeriesProvider>
      <Container style={{maxWidth: "991.98px"}}>
        <Row>
          <Col sm={4} xl={3}>
            <SucursalesLst />
          </Col>
          <Col sm={8} xl={9}>
            <SeriesSucursalTbl />
          </Col>
        </Row>
        <SerieSucursalForm />
      </Container>
    </SeriesProvider>
  );
}
