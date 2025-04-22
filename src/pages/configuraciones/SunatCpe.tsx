import { useEffect, useState } from "react";
import { Accordion, Button, Col, Form, Row } from "react-bootstrap";
import { FormControlElement } from "../../core/types";
import { useMutationConfiguracionesQuery } from "../../core/hooks/useConfiguracionesQuery";

const CpeFactInit = {
  desarrollo: "",
  produccion: "",
  default: "",
}
const CpeGuiaInit = {
  desarrollo_client_id: "",
  produccion_client_id: "",
  desarrollo_client_secret: "",
  produccion_client_secret: "",
  desarrollo_client_auth: "",
  produccion_client_auth: "",
  desarrollo_client_cpe: "",
  produccion_client_cpe: "",
  default: "",
}

export default function SunatCpe() {
  const [formCpeFact, setFormCpeFact] = useState(CpeFactInit)
  const [formCpeGuia, setFormCpeGuia] = useState(CpeGuiaInit)

  const {
    data: dataObtenerCpeFact,
    obtenerCpeFact
  } = useMutationConfiguracionesQuery()
  const {
    data: dataActualizarCpeFact,
    actualizarCpeFact
  } = useMutationConfiguracionesQuery()
  const {
    data: dataActualizarCpeGuia,
    actualizarCpeGuia
  } = useMutationConfiguracionesQuery()

  const {
    data: dataObtenerCpeGuia,
    obtenerCpeGuia
  } = useMutationConfiguracionesQuery()

  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    const {name, value, dataset} = e.target
    if(dataset.form === "formCpeFact"){
      setFormCpeFact({...formCpeFact, [name]:value})
    }else if(dataset.form === "formCpeGuia"){
      setFormCpeGuia({...formCpeGuia, [name]:value})
    }
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const {form} = e.currentTarget.dataset
    if(form === "formCpeFact"){
      console.log(formCpeFact)
      actualizarCpeFact(formCpeFact)
    }else if(form === "formCpeGuia"){
      console.log(formCpeGuia)
      actualizarCpeGuia(formCpeGuia)

    }
  }

  useEffect(() => {
    obtenerCpeFact()
    obtenerCpeGuia()
  },[])

  useEffect(() => {
    if(!dataObtenerCpeFact) return
    setFormCpeFact(JSON.parse(dataObtenerCpeFact.doc_value))
  },[dataObtenerCpeFact])
  
  useEffect(() => {
    if(!dataObtenerCpeGuia) return
    setFormCpeGuia(JSON.parse(dataObtenerCpeGuia.doc_value))
  },[dataObtenerCpeGuia])

  return (
    <div className='position-relative'>
      <Accordion defaultActiveKey={['0','1','2']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>MODO FACTURACIÓN / WEBSERVICE SUNAT</Accordion.Header>
          <Accordion.Body>
            <Form className='mx-4' onSubmit={handleSubmit} data-form="formCpeFact">
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Desarrollo</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="desarrollo"
                    value={formCpeFact?.desarrollo}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Producción</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="produccion"
                    value={formCpeFact?.produccion}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Modo Facturación</Form.Label>
                <Col sm="10">
                  <Form.Select 
                    name="default"
                    value={formCpeFact?.default}
                    onChange={handleChange}
                  >
                    <option value="desarrollo">DESARROLLO</option>
                    <option value="produccion">PRODUCCIÓN</option>
                  </Form.Select>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3 px-5">
                <Button type='submit'>Guardar</Button>
              </Form.Group>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>MODO GUÍA DE REMISIÓN / API SUNAT</Accordion.Header>
          <Accordion.Body>
            <Form className='mx-4' onSubmit={handleSubmit} data-form="formCpeGuia">
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Client Id desarrollo</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="desarrollo_client_id"
                    value={formCpeGuia?.desarrollo_client_id}
                    onChange={handleChange}/>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Client Id producción</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="produccion_client_id"
                    value={formCpeGuia?.produccion_client_id}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Client Secret desarrollo</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="desarrollo_client_secret"
                    value={formCpeGuia?.desarrollo_client_secret}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Client Secret producción</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="produccion_client_secret"
                    value={formCpeGuia?.produccion_client_secret}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">APi Auth desarrollo</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="desarrollo_client_auth"
                    value={formCpeGuia?.desarrollo_client_auth}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">APi Auth producción</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="produccion_client_auth"
                    value={formCpeGuia?.produccion_client_auth}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">APi Cpe desarrollo</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="desarrollo_client_cpe"
                    value={formCpeGuia?.desarrollo_client_cpe}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">APi Cpe producción</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="produccion_client_cpe"
                    value={formCpeGuia?.produccion_client_cpe}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Modo guía de remisión</Form.Label>
                <Col sm="9">
                  <Form.Select 
                    name="default"
                    value={formCpeGuia?.default}
                    onChange={handleChange}
                  >
                    <option value="desarrollo">DESARROLLO</option>
                    <option value="produccion">PRODUCCIÓN</option>
                  </Form.Select>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3 px-5">
                <Button type='submit'>Guardar</Button>
              </Form.Group>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>USUARIO SOL SECUNDARIO</Accordion.Header>
          <Accordion.Body>

          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* {(isPending || isPendingOnMutate) && <LdsEllipsisCenter />} */}
      {/* <ConfirmPass
        show = {showConfirmPass}
        setShow = {setShowConfirmPass}
        onSuccess = {onSuccessConfirmPass}
      /> */}
    </div>
  )
}
