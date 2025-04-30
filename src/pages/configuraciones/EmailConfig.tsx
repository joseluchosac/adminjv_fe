import { useEffect, useState } from "react"
import { Accordion, Button, Col, Form, Row } from "react-bootstrap"
import { FormControlElement } from "../../core/types"
import { useMutationConfiguracionesQuery } from "../../core/hooks/useConfiguracionesQuery"
import { LdsBar } from "../../core/components/Loaders"

const emailConfigInit = {
  host: "",
  username: "",
  password: "",
  smtp_secure: "",
  port: "",
  empresa: ""
}

export default function EmailConfig() {
  const [formEmailConfig, setFormEmailConfig] = useState(emailConfigInit)
  
  const {
    data: dataGetEmailConfig,
    isPending: isPendingGetEmailConfig,
    getEmailConfig
  } = useMutationConfiguracionesQuery()

  const {
    data: dataUpdateEmailConfig,
    isPending: isPendingUpdateEmailConfig,
    updateEmailConfig
  } = useMutationConfiguracionesQuery()


  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    const {name, value} = e.target
    setFormEmailConfig({...formEmailConfig, [name]: value})
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateEmailConfig(formEmailConfig)
  }

  useEffect(() => {
    getEmailConfig()
  }, [])

  useEffect(()=>{
    if(!dataGetEmailConfig) return
    setFormEmailConfig(JSON.parse(dataGetEmailConfig.doc_value))
  },[dataGetEmailConfig])

  useEffect(()=>{
    if(!dataUpdateEmailConfig) return
    console.log(dataUpdateEmailConfig)
  },[dataUpdateEmailConfig])

  return (
    <div className='position-relative'>
      <Accordion defaultActiveKey={['0']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>CONFIGURACIÓN DE CORREO</Accordion.Header>
          <Accordion.Body className="position-relative">
            {(isPendingGetEmailConfig || isPendingUpdateEmailConfig) && <LdsBar />}
            <Form className='mx-4' onSubmit={handleSubmit} data-form="formCpeFact">
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Host</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="host"
                    value={formEmailConfig?.host}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Username</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="username"
                    value={formEmailConfig?.username}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Password</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="password"
                    value={formEmailConfig?.password}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">SMTP secure</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="smtp_secure"
                    value={formEmailConfig?.smtp_secure}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Port</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="port"
                    value={formEmailConfig?.port}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Empresa</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="empresa"
                    value={formEmailConfig?.empresa}
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
    </div>
  )
}
