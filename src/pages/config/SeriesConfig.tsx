import { Accordion } from "react-bootstrap"
import Series from "./series/Series"

export default function SeriesConfig() {
  return (
    <div className='position-relative'>
    <Accordion alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Header>SERIES Y CORRELATIVOS</Accordion.Header>
        <Accordion.Body className="position-relative">
          <Series />
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>OTROS</Accordion.Header>
        <Accordion.Body className="position-relative">
          
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </div>
  )
}
