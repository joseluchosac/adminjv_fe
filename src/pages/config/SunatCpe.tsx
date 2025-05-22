import { useEffect, useRef, useState } from "react";
import { Accordion, Button, Col, Form, Row } from "react-bootstrap";
import { FormControlElement } from "../../core/types";
import { useMutationConfigQuery } from "../../core/hooks/useConfigQuery";
import { ConfirmPass } from "../../core/components/ConfirmsMdl";
import { Bounce, toast } from "react-toastify";
import { LdsBar } from "../../core/components/Loaders";

const cpeFactFormInit = {
  desarrollo: "",
  produccion: "",
  default: "",
}
const cpeGuiaFormInit = {
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

const usuarioSolSecFormInit = {
  usuario_sol: "",
  clave_sol: ""
}

export default function SunatCpe() {
  const [cpeFactForm, setCpeFactForm] = useState(cpeFactFormInit)
  const [cpeGuiaForm, setCpeGuiaForm] = useState(cpeGuiaFormInit)
  const [usuarioSolSecForm, setUsuarioSolSecForm] = useState(usuarioSolSecFormInit)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const formActual = useRef('')

  const {
    data: cpeFact,
    isPending: isPendingCpeFact,
    getCpeFact,
  } = useMutationConfigQuery()
  const {
    data: cpeGuia,
    isPending: isPendingCpeGuia,
    getCpeGuia,
  } = useMutationConfigQuery()
  const {
    data: usuarioSolSec,
    isPending: isPendingUsuarioSolSec,
    getUsuarioSolSec,
  } = useMutationConfigQuery()

  const {
    data: mutation,
    isPending: isPendingMutation,
    updateCpeFact,
    updateCpeGuia,
    updateUsuarioSolSec,
    typeAction
  } = useMutationConfigQuery()

  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    const {name, value} = e.target
    const form = e.target.closest('form')?.dataset.form as string
    if(form === "cpeFactForm"){
      setCpeFactForm({...cpeFactForm, [name]:value})
    }else if(form === "cpeGuiaForm"){
      setCpeGuiaForm({...cpeGuiaForm, [name]:value})
    }else if(form === "usuarioSolSecForm"){
      setUsuarioSolSecForm({...usuarioSolSecForm, [name]:value})
    }
  }

  const onSuccessConfirmPass = () => {
    if(formActual.current === "cpeFactForm"){
      updateCpeFact(cpeFactForm)
    }else if(formActual.current === "cpeGuiaForm"){
      updateCpeGuia(cpeGuiaForm)
    }else if(formActual.current === "usuarioSolSecForm"){
      updateUsuarioSolSec(usuarioSolSecForm)
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
    if(!cpeFact) return
    setCpeFactForm(JSON.parse(cpeFact.doc_value))
  },[cpeFact])

  useEffect(() => {
    if(!cpeGuia) return
    setCpeGuiaForm(JSON.parse(cpeGuia.doc_value))
  },[cpeGuia])
  
  useEffect(() => {
    if(!usuarioSolSec) return
    setUsuarioSolSecForm(JSON.parse(usuarioSolSec.doc_value))
  },[usuarioSolSec])

  useEffect(() => {
    if(!mutation) return
    if(typeAction.includes("mutate")){
      toast(mutation?.msg, {
        type: mutation?.msgType,
        autoClose: 3000,
        transition: Bounce,
      })
    }
  },[mutation])


  return (
    <div className='position-relative'>
      <Accordion defaultActiveKey={['0','1','2']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>MODO FACTURACIÓN / WEBSERVICE SUNAT</Accordion.Header>
          <Accordion.Body className="position-relative">
            {(isPendingCpeFact || isPendingMutation && typeAction==="mutate_cpe_fact") && <LdsBar />}
            <Form className='mx-4' onSubmit={handleSubmit} data-form="cpeFactForm">
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Desarrollo</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="desarrollo"
                    value={cpeFactForm?.desarrollo}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Producción</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="produccion"
                    value={cpeFactForm?.produccion}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Modo Facturación</Form.Label>
                <Col sm="10">
                  <Form.Select 
                    name="default"
                    value={cpeFactForm?.default}
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
            {(isPendingCpeGuia || isPendingMutation && typeAction==="mutate_cpe_guia") && <LdsBar />}
            <Form className='mx-4' onSubmit={handleSubmit} data-form="cpeGuiaForm">
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Client Id desarrollo</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="desarrollo_client_id"
                    value={cpeGuiaForm?.desarrollo_client_id}
                    onChange={handleChange}/>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Client Id producción</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="produccion_client_id"
                    value={cpeGuiaForm?.produccion_client_id}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Client Secret desarrollo</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="desarrollo_client_secret"
                    value={cpeGuiaForm?.desarrollo_client_secret}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Client Secret producción</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="produccion_client_secret"
                    value={cpeGuiaForm?.produccion_client_secret}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">APi Auth desarrollo</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="desarrollo_client_auth"
                    value={cpeGuiaForm?.desarrollo_client_auth}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">APi Auth producción</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="produccion_client_auth"
                    value={cpeGuiaForm?.produccion_client_auth}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">APi Cpe desarrollo</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="desarrollo_client_cpe"
                    value={cpeGuiaForm?.desarrollo_client_cpe}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">APi Cpe producción</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="produccion_client_cpe"
                    value={cpeGuiaForm?.produccion_client_cpe}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Modo guía de remisión</Form.Label>
                <Col sm="9">
                  <Form.Select 
                    name="default"
                    value={cpeGuiaForm?.default}
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
            {(isPendingUsuarioSolSec || isPendingMutation && typeAction==="mutate_usuario_sol_sec") && <LdsBar />}
            <Form className='mx-4' onSubmit={handleSubmit} data-form="usuarioSolSecForm">
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Usuario SOL</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="usuario_sol"
                    value={usuarioSolSecForm?.usuario_sol}
                    onChange={handleChange}
                    />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Clave SOL</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="clave_sol"
                    value={usuarioSolSecForm?.clave_sol}
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
