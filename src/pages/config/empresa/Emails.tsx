import { useEffect, useState } from "react"
import { useMutationConfigQuery } from "../../../core/hooks/useConfigQuery"
import { FormControlElement } from "../../../core/types"
import { LdsBar } from "../../../core/components/Loaders"
import { Button, Col, Form, Row } from "react-bootstrap"

const emailConfigFormInit = {
  host: "",
  username: "",
  password: "",
  smtp_secure: "",
  port: "",
  empresa: ""
}

export default function Emails() {
  const [emailConfigForm, setEmailConfigForm] = useState(emailConfigFormInit)
  
  const {
    data: emailConfig,
    isPending: isPendingEmailConfig,
    getEmailConfig
  } = useMutationConfigQuery()

  const {
    data: mutation,
    isPending: isPendingMutation,
    updateEmailConfig
  } = useMutationConfigQuery()


  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    const {name, value} = e.target
    setEmailConfigForm({...emailConfigForm, [name]: value})
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    updateEmailConfig(emailConfigForm)
  }

  useEffect(() => {
    getEmailConfig()
  }, [])

  useEffect(()=>{
    if(!emailConfig) return
    setEmailConfigForm(JSON.parse(emailConfig.doc_value))
  },[emailConfig])

  useEffect(()=>{
    if(!mutation) return
    console.log(mutation)
  },[mutation])

  return (
    <div>
      {(isPendingEmailConfig || isPendingMutation) && <LdsBar />}
      <Form className='mx-4' onSubmit={handleSubmit} data-form="formCpeFact">
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Host</Form.Label>
          <Col sm="10">
            <Form.Control 
              name="host"
              value={emailConfigForm?.host}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Username</Form.Label>
          <Col sm="10">
            <Form.Control 
              name="username"
              value={emailConfigForm?.username}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Password</Form.Label>
          <Col sm="10">
            <Form.Control 
              name="password"
              value={emailConfigForm?.password}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">SMTP secure</Form.Label>
          <Col sm="10">
            <Form.Control 
              name="smtp_secure"
              value={emailConfigForm?.smtp_secure}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Port</Form.Label>
          <Col sm="10">
            <Form.Control 
              name="port"
              value={emailConfigForm?.port}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">Empresa</Form.Label>
          <Col sm="10">
            <Form.Control 
              name="empresa"
              value={emailConfigForm?.empresa}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3 px-5">
          <Button type='submit'>Guardar</Button>
        </Form.Group>
      </Form>
    </div>
  )
}
