import { useState } from "react";
import { Container } from "react-bootstrap";
import TiposDocumento from "./TiposDocumento";
import TiposComprobante from "./TiposComprobante";
import TiposMoneda from "./TiposMoneda";
import ListCatalogos from "./ListCatalogos";

export default function CatalogosPage() {
  const [currentCatalogo, setCurrentCatalogo] = useState("")
  return (
    <Container style={{maxWidth: "991.98px"}}>
      <ListCatalogos setCurrentCatalogo={setCurrentCatalogo} />
      <div>
        {(currentCatalogo === "tipos_comprobante") && <TiposComprobante />}
        {(currentCatalogo === "tipos_documento") && <TiposDocumento />}
        {(currentCatalogo === "tipos_moneda") && <TiposMoneda />}
      </div>
  </Container>
  )
}
