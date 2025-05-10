import { Accordion} from "react-bootstrap"
import Empresa from "./empresa/Empresa"
import Emails from "./empresa/Emails"
import Establecimientos from "./empresa/Establecimientos"
export default function EmpresaConfig() {
  return (
    <div className='position-relative'>
      {/* <Accordion defaultActiveKey={['0','1','2]} alwaysOpen> */}
      <Accordion alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>DATOS DE LA EMPRESA</Accordion.Header>
          <Accordion.Body className="position-relative">
            <Empresa />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>ESTABLECIMIENTOS (Sucursales y Almacenes)</Accordion.Header>
          <Accordion.Body className="position-relative">
            <Establecimientos />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>CONFIGURACION DE CORREO</Accordion.Header>
          <Accordion.Body className="position-relative">
            <Emails />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}
