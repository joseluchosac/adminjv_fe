import { useState } from "react";
import { Container } from "react-bootstrap";
import TiposDocumento from "../../features/catalogos/TiposDocumento";
import TiposComprobante from "../../features/catalogos/TiposComprobante";
import TiposMoneda from "../../features/catalogos/TiposMoneda";
import ListCatalogos from "../../features/catalogos/ListCatalogos";

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
