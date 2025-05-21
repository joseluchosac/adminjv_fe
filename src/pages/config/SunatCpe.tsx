import { useEffect, useRef, useState } from "react";
import { Accordion, Button, Col, Form, Row } from "react-bootstrap";
import { FormControlElement } from "../../core/types";
import { useMutationConfigQuery } from "../../core/hooks/useConfigQuery";
import { ConfirmPass } from "../../core/components/ConfirmsMdl";
import { Bounce, toast } from "react-toastify";
import { LdsBar } from "../../core/components/Loaders";

const formCpeFactInit = {
  desarrollo: "",
  produccion: "",
  default: "",
}
const formCpeGuiaInit = {
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

const formUsuarioSolSecInit = {
  usuario_sol: "",
  clave_sol: ""
}

export default function SunatCpe() {
  const [formCpeFact, setFormCpeFact] = useState(formCpeFactInit)
  const [formCpeGuia, setFormCpeGuia] = useState(formCpeGuiaInit)
  const [formUsuarioSolSec, setFormUsuarioSolSec] = useState(formUsuarioSolSecInit)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const formActual = useRef('')

  const {
    data: cpeFact,
    isPending: isPending_cpeFact,
    getCpeFact,
  } = useMutationConfigQuery()
  const {
    data: cpeGuia,
    isPending: isPending_cpeGuia,
    getCpeGuia,
  } = useMutationConfigQuery()
  const {
    data: usuarioSolSec,
    isPending: isPending_usuarioSolSec,
    getUsuarioSolSec,
  } = useMutationConfigQuery()

  const {
    data,
    isPending,
    updateCpeFact,
    updateCpeGuia,
    updateUsuarioSolSec,
    typeAction
  } = useMutationConfigQuery()

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
      updateCpeFact(formCpeFact)
    }else if(formActual.current === "formCpeGuia"){
      updateCpeGuia(formCpeGuia)
    }else if(formActual.current === "formUsuarioSolSec"){
      updateUsuarioSolSec(formUsuarioSolSec)
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
    setFormCpeFact(JSON.parse(cpeFact.doc_value))
  },[cpeFact])
  useEffect(() => {
    if(!cpeGuia) return
    setFormCpeGuia(JSON.parse(cpeGuia.doc_value))
  },[cpeGuia])
  useEffect(() => {
    if(!usuarioSolSec) return
    setFormUsuarioSolSec(JSON.parse(usuarioSolSec.doc_value))
  },[usuarioSolSec])

  useEffect(() => {
    if(!data) return
    if(typeAction.includes("mutate")){
      toast(data?.msg, {
        type: data?.msgType,
        autoClose: 3000,
        transition: Bounce,
      })
    }
  },[data])


  return (
    <div className='position-relative'>
      <Accordion defaultActiveKey={['0','1','2']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>MODO FACTURACIÓN / WEBSERVICE SUNAT</Accordion.Header>
          <Accordion.Body className="position-relative">
            {(isPending_cpeFact || isPending && typeAction==="mutate_cpe_fact") && <LdsBar />}
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
            {(isPending_cpeGuia || isPending && typeAction==="mutate_cpe_guia") && <LdsBar />}
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
            {(isPending_usuarioSolSec || isPending && typeAction==="mutate_usuario_sol_sec") && <LdsBar />}
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
