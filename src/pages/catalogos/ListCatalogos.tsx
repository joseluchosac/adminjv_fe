import { useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";

type Props = {
  setCurrentCatalogo: (catalogo: string) => void;
}

const list = [
  {nombre:"tipos_comprobante", text: "TIPOS DE COMPROBANTE"},
  {nombre:"tipos_documento", text: "TIPOS DE DOCUMENTO"},
  {nombre:"tipos_moneda", text: "TIPOS DE MONEDA"},
]

export default function ListCatalogos({setCurrentCatalogo}: Props) {

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nombre = e.target.value
    setCurrentCatalogo(nombre)
  }

  useEffect(() => {
    setCurrentCatalogo(list[0].nombre)
  }, [])

  return (
    <Row className="mb-3">
      <Col className="d-flex align-items-center" md={2}>
        <div className="text-center">Seleccione</div>
      </Col>
      <Col>
        <Form.Select onChange={handleSelect}>
          {list.map((el, index)=>{
            return (
              <option 
                key={index} 
                data-nombre={el.nombre}
                value={el.nombre}
                >
                {el.text}
              </option>
            )
          })}
        </Form.Select>
      </Col>
    </Row>
  )
}
