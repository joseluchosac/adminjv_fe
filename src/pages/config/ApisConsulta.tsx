import { useEffect, useState } from "react"
import { Accordion, Button, Col, Form, Row } from "react-bootstrap"
import { FormControlElement } from "../../core/types"
import { useMutationConfigQuery } from "../../core/hooks/useConfigQuery"
import { ConfirmPass } from "../../core/components/ConfirmsMdl"
import { toast } from "react-toastify"
import { LdsBar } from "../../core/components/Loaders"

const apisNroDocInit = {
  apisnetpe:{
    dni:"",
    ruc:"",
    token:""
  },
  apisperucom:{
    dni:"",
    ruc:"",
    token:""
  },
  default:"",
}

export default function ApisConsulta() {
  const [apisNroDocForm, setApisNroDocForm] = useState(apisNroDocInit)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const {
    data: apisNroDoc,
    isPending: isPendingApisNroDoc,
    getApisNroDoc
  } = useMutationConfigQuery()
  const {
    data: mutationApisNroDoc,
    isPending: isPendingMutationApisNroDoc,
    updateApisNroDoc
  } = useMutationConfigQuery()


  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    const {name, value} = e.target
    if(name === "default"){
      setApisNroDocForm({...apisNroDocForm, default:value})
    }else{
      const serv = name.split("_")[0] as "apisnetpe" | "apisperucom"
      const campo = name.split("_")[1]
      setApisNroDocForm({...apisNroDocForm, [serv]:{...apisNroDocForm[serv], [campo]:value}})
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowConfirmPass(true)
  }
  
  const onSuccessConfirmPass = () => {
    updateApisNroDoc(apisNroDocForm)
  }

  useEffect(() => {
    getApisNroDoc()
  }, [])
  
  useEffect(()=>{
    if(!apisNroDoc) return
    const obj = JSON.parse(apisNroDoc.doc_value)
    setApisNroDocForm(obj)
  },[apisNroDoc])

  useEffect(()=>{
    if(!mutationApisNroDoc) return
    toast(mutationApisNroDoc?.msg, {type: mutationApisNroDoc?.msgType})
  },[mutationApisNroDoc])

  return (
    <div>
      <Accordion defaultActiveKey={['0']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>DNI, RUC</Accordion.Header>
          <Accordion.Body className="position-relative">
            {(isPendingApisNroDoc || isPendingMutationApisNroDoc) && <LdsBar />}
            <Form onSubmit={handleSubmit}>
              <Row>
                <h6 className="mb-3">APIS.NET.PE</h6>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column htmlFor="apisnetpe_dni" sm="2">DNI</Form.Label>
                  <Col sm="10">
                    <Form.Control 
                      onChange={handleChange}
                      id="apisnetpe_dni"
                      name="apisnetpe_dni"
                      value={apisNroDocForm.apisnetpe.dni}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column htmlFor="apisnetpe_ruc" sm="2">RUC</Form.Label>
                  <Col sm="10">
                    <Form.Control 
                      onChange={handleChange}
                      id="apisnetpe_ruc"
                      name="apisnetpe_ruc"
                      value={apisNroDocForm.apisnetpe.ruc}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2" htmlFor="apisnetpe_token">TOKEN</Form.Label>
                  <Col sm="10">
                    <Form.Control
                      id="apisnetpe_token"
                      name="apisnetpe_token"
                      onChange={handleChange}
                      value={apisNroDocForm.apisnetpe.token}
                    />
                  </Col>
                </Form.Group>
                <h6 className="mb-3">APISPERU.COM</h6>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column htmlFor="apisperucom_dni" sm="2">DNI</Form.Label>
                  <Col sm="10">
                    <Form.Control 
                      id="apisperucom_dni"
                      name="apisperucom_dni"
                      onChange={handleChange}
                      value={apisNroDocForm.apisperucom.dni}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column htmlFor="apisperucom_ruc" sm="2">RUC</Form.Label>
                  <Col sm="10">
                    <Form.Control 
                      id="apisperucom_ruc"
                      name="apisperucom_ruc"
                      onChange={handleChange}
                      value={apisNroDocForm.apisperucom.ruc}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column htmlFor="apisperucom_token" sm="2">TOKEN</Form.Label>
                  <Col sm="10">
                    <Form.Control 
                      id="apisperucom_token"
                      name="apisperucom_token"
                      onChange={handleChange}
                      value={apisNroDocForm.apisperucom.token}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column htmlFor="default" sm="3">Api predefinida</Form.Label>
                  <Col sm="9">
                    <Form.Select 
                      id="default"
                      name="default"
                      onChange={handleChange}
                      value={apisNroDocForm.default}
                    >
                      <option value="">-Seleccione-</option>
                      <option value="apisnetpe">apis.net.pe</option>
                      <option value="apisperucom">apisperu.com</option>
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Row>
              <Row>
                <Col className="text-end">
                  <Button 
                    variant="primary" 
                    type="submit"
                  >
                    Guardar
                  </Button>
                </Col>
              </Row>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <ConfirmPass
        show = {showConfirmPass}
        setShow = {setShowConfirmPass}
        onSuccess = {onSuccessConfirmPass}
      />
    </div>
  )
}
