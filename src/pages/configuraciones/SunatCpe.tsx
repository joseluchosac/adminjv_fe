import { useEffect, useRef, useState } from "react";
import { Accordion, Button, Col, Form, Row } from "react-bootstrap";
import { FormControlElement } from "../../core/types";
import { useMutationConfiguracionesQuery } from "../../core/hooks/useConfiguracionesQuery";
import { ConfirmPass } from "../../core/components/ConfirmsMdl";
import { Bounce, toast } from "react-toastify";
import { LdsBar } from "../../core/components/Loaders";

const cpeFactInit = {
  desarrollo: "",
  produccion: "",
  default: "",
}
const cpeGuiaInit = {
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

const usuarioSolSecInit = {
  usuario_sol: "",
  clave_sol: ""
}

export default function SunatCpe() {
  const [formCpeFact, setFormCpeFact] = useState(cpeFactInit)
  const [formCpeGuia, setFormCpeGuia] = useState(cpeGuiaInit)
  const [formUsuarioSolSec, setFormUsuarioSolSec] = useState(usuarioSolSecInit)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const formActual = useRef('')

  const {
    data: dataGetCpeFact,
    isPending: isPendingGetCpeFact,
    getCpeFact
  } = useMutationConfiguracionesQuery()

  const {
    data: dataActualizarCpeFact,
    isPending: isPendingActualizarCpeFact,
    actualizarCpeFact
  } = useMutationConfiguracionesQuery()

  const {
    data: dataGetCpeGuia,
    isPending: isPendingGetCpeGuia,
    getCpeGuia
  } = useMutationConfiguracionesQuery()

  const {
    data: dataActualizarCpeGuia,
    isPending: isPendingActualizarCpeGuia,
    actualizarCpeGuia
  } = useMutationConfiguracionesQuery()

  const {
    data: dataGetUsuarioSolSec,
    isPending: isPendingGetUsuarioSolSec,
    getUsuarioSolSec
  } = useMutationConfiguracionesQuery()

  const {
    data: dataActualizarUsuarioSolSec,
    isPending: isPendingActualizarUsuarioSolSec,
    actualizarUsuarioSolSec
  } = useMutationConfiguracionesQuery()


  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    const {name, value} = e.target
    const form = e.target.closest('form')?.dataset.form as string
    if(form === "formCpeFact"){
      setFormCpeFact({...formCpeFact, [name]:value})
    }else if(form === "formCpeGuia"){
      setFormCpeGuia({...formCpeGuia, [name]:value})
    }else if(form === "formUsuarioSolSec"){
      setFormUsuarioSolSec({...formUsuarioSolSec, [name]:value})
    }
  }

  const onSuccessConfirmPass = () => {
    if(formActual.current === "formCpeFact"){
      actualizarCpeFact(formCpeFact)
    }else if(formActual.current === "formCpeGuia"){
      actualizarCpeGuia(formCpeGuia)
    }else if(formActual.current === "formUsuarioSolSec"){
      actualizarUsuarioSolSec(formUsuarioSolSec)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const {form} = e.currentTarget.dataset
    formActual.current = form as string
    setShowConfirmPass(true)
  }

  useEffect(() => {
    getCpeFact()
    getCpeGuia()
    getUsuarioSolSec()
  },[])

  useEffect(() => {
    if(!dataGetCpeFact) return
    setFormCpeFact(JSON.parse(dataGetCpeFact.doc_value))
  },[dataGetCpeFact])
  
  useEffect(() => {
    if(!dataGetCpeGuia) return
    setFormCpeGuia(JSON.parse(dataGetCpeGuia.doc_value))
  },[dataGetCpeGuia])

  useEffect(() => {
    if(!dataGetUsuarioSolSec) return
    setFormUsuarioSolSec(JSON.parse(dataGetUsuarioSolSec.doc_value))
  },[dataGetUsuarioSolSec])

  useEffect(() => {
    if(!dataActualizarCpeFact) return
    toast(dataActualizarCpeFact?.msg, {
      type: dataActualizarCpeFact?.msgType,
      autoClose: 3000,
      transition: Bounce,
    })
  },[dataActualizarCpeFact])

  useEffect(() => {
    if(!dataActualizarCpeGuia) return
    toast(dataActualizarCpeGuia?.msg, {
      type: dataActualizarCpeGuia?.msgType,
      autoClose: 3000,
      transition: Bounce,
    })
  },[dataActualizarCpeGuia])

  useEffect(() => {
    if(!dataActualizarUsuarioSolSec) return
    toast(dataActualizarUsuarioSolSec?.msg, {
      type: dataActualizarUsuarioSolSec?.msgType,
      autoClose: 3000,
      transition: Bounce,
    })
  },[dataActualizarUsuarioSolSec])

  return (
    <div className='position-relative'>
      <Accordion defaultActiveKey={['0','1','2']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>MODO FACTURACIÓN / WEBSERVICE SUNAT</Accordion.Header>
          <Accordion.Body className="position-relative">
            {(isPendingGetCpeFact || isPendingActualizarCpeFact) && <LdsBar />}
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
          <Accordion.Body className="position-relative">
            {(isPendingGetCpeGuia || isPendingActualizarCpeGuia) && <LdsBar />}
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
          <Accordion.Body className="position-relative">
            {(isPendingGetUsuarioSolSec || isPendingActualizarUsuarioSolSec) && <LdsBar />}
            <Form className='mx-4' onSubmit={handleSubmit} data-form="formUsuarioSolSec">
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Usuario SOL</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="usuario_sol"
                    value={formUsuarioSolSec?.usuario_sol}
                    onChange={handleChange}
                    />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Clave SOL</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="clave_sol"
                    value={formUsuarioSolSec?.clave_sol}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3 px-5">
                <Button type='submit'>Guardar</Button>
              </Form.Group>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* {(isPending || isPendingOnMutate) && <LdsEllipsisCenter />} */}
      <ConfirmPass
        show = {showConfirmPass}
        setShow = {setShowConfirmPass}
        onSuccess = {onSuccessConfirmPass}
      />
    </div>
  )
}
