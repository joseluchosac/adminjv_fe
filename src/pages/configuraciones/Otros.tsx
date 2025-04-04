import { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import { useMutationConfiguracionesQuery } from '../../core/hooks/useConfiguracionesQuery';
import { LdsEllipsisCenter } from '../../core/components/Loaders';
import { Bounce, toast } from 'react-toastify';
import { ConfirmPass } from '../../core/components/ConfirmsMdl';

const frmDataInit = {
  modoFacturacion: {
      desarrollo: "",
      modo_facturacion: "",
      produccion: "",
      tabla_id: "",
  },
  modoGuiaDeRemision: {
      api_auth_desarrollo: "",
      api_auth_produccion: "",
      api_cpe_desarrollo: "",
      api_cpe_produccion: "",
      client_id_desarrollo: "",
      client_id_produccion: "",
      client_secret_desarrollo: "",
      client_secret_produccion: "",
      modo_guia_de_remision: "",
      tabla_id: "",
  },
  usuarioSolSecundario: {
      clave_sol: "",
      tabla_id: "",
      usuario_sol: "",
  },
  servidorCorreo: {
      host: "",
      nombre_empresa: "",
      password: "",
      port: "",
      smtpsecure: "",
      tabla_id: "",
      username: "",
  }
}

function Otros() {
  const [frmData, setFrmData] = useState(frmDataInit)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [currentForm, setCurrentForm] = useState("")
  const {
    data,
    isPending,
    obtenerConfiguraciones
  }:{data: typeof frmDataInit, isPending: boolean, obtenerConfiguraciones:any} = useMutationConfiguracionesQuery()
  const {
    data: dataOnUpdate,
    isPending: isPendingOnMutate,
    actualizarConfiguraciones
  } = useMutationConfiguracionesQuery()

  const handleChange = (e: React.ChangeEvent<any>) => {
    const {name, value} = e.target;
    const form = e.target.closest("form").dataset.form as keyof typeof frmData
    setFrmData({...frmData, [form]: {...frmData[form], [name]: value}})
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCurrentForm(e.currentTarget.dataset.form as string)
    setShowConfirmPass(true)
  }
  
  const onSuccessConfirmPass = () => {
    actualizarConfiguraciones(frmData[currentForm as keyof typeof frmData])
  }

  useEffect(() => {
    obtenerConfiguraciones()
  }, [])

  useEffect(()=>{
    if(!data) return
    setFrmData(data)
  },[data])
  useEffect(()=>{
    if(!dataOnUpdate) return
    toast(dataOnUpdate?.msg, {
      type: dataOnUpdate?.msgType,
      autoClose: 3000,
      transition: Bounce,
    })
  },[dataOnUpdate])

  return (
    <div className='position-relative'>
      <Accordion defaultActiveKey={['0','1','2','3']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>MODO FACTURACIÓN / WEBSERVICE SUNAT</Accordion.Header>
          <Accordion.Body>
            <Form className='mx-4' onSubmit={handleSubmit} data-form="modoFacturacion">
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Desarrollo</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="desarrollo"
                    value={frmData?.modoFacturacion.desarrollo}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Producción</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="produccion"
                    value={frmData?.modoFacturacion.produccion}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Modo Facturación</Form.Label>
                <Col sm="10">
                  <Form.Select 
                    name="modo_facturacion"
                    value={frmData?.modoFacturacion.modo_facturacion}
                    onChange={handleChange}
                  >
                    <option value="DESARROLLO">DESARROLLO</option>
                    <option value="PRODUCCION">PRODUCCIÓN</option>
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
            <Form className='mx-4' onSubmit={handleSubmit} data-form="modoGuiaDeRemision">
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Client Id desarrollo</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="client_id_desarrollo"
                    value={frmData?.modoGuiaDeRemision.client_id_desarrollo}
                    onChange={handleChange}/>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Client Id producción</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="client_id_produccion"
                    value={frmData?.modoGuiaDeRemision.client_id_produccion}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Client Secret desarrollo</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="client_secret_desarrollo"
                    value={frmData?.modoGuiaDeRemision.client_secret_desarrollo}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Client Secret producción</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="client_secret_produccion"
                    value={frmData?.modoGuiaDeRemision.client_secret_produccion}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">APi Auth desarrollo</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="api_auth_desarrollo"
                    value={frmData?.modoGuiaDeRemision.api_auth_desarrollo}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">APi Auth producción</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="api_auth_produccion"
                    value={frmData?.modoGuiaDeRemision.api_auth_produccion}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">APi Cpe desarrollo</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="api_cpe_desarrollo"
                    value={frmData?.modoGuiaDeRemision.api_cpe_desarrollo}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">APi Cpe producción</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="api_cpe_produccion"
                    value={frmData?.modoGuiaDeRemision.api_cpe_produccion}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Modo guía de remisión</Form.Label>
                <Col sm="9">
                  <Form.Select 
                    name="modo_guia_de_remision"
                    value={frmData?.modoGuiaDeRemision.modo_guia_de_remision}
                    onChange={handleChange}
                  >
                    <option value="DESARROLLO">DESARROLLO</option>
                    <option value="PRODUCCION">PRODUCCIÓN</option>
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
            <Form className='mx-4' onSubmit={handleSubmit} data-form="usuarioSolSecundario">
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Usuario SOL</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="usuario_sol"
                    value={frmData?.usuarioSolSecundario.usuario_sol}
                    onChange={handleChange}
                    />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="3">Clave SOL</Form.Label>
                <Col sm="9">
                  <Form.Control 
                    name="clave_sol"
                    value={frmData?.usuarioSolSecundario.clave_sol}
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
        <Accordion.Item eventKey="3">
          <Accordion.Header>SERVIDOR DE CORREO</Accordion.Header>
          <Accordion.Body>
            <Form className='mx-4' onSubmit={handleSubmit} data-form="servidorCorreo">
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Host</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="host"
                    value={frmData?.servidorCorreo.host}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Username</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="username"
                    value={frmData?.servidorCorreo.username}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Password</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="password"
                    value={frmData?.servidorCorreo.password}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">SMTP Secure</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="smtpsecure"
                    value={frmData?.servidorCorreo.smtpsecure}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Port</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="port"
                    value={frmData?.servidorCorreo.port}
                    onChange={handleChange}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">Empresa</Form.Label>
                <Col sm="10">
                  <Form.Control 
                    name="nombre_empresa"
                    value={frmData?.servidorCorreo.nombre_empresa}
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
      {(isPending || isPendingOnMutate) && <LdsEllipsisCenter />}
      <ConfirmPass
        show = {showConfirmPass}
        setShow = {setShowConfirmPass}
        onSuccess = {onSuccessConfirmPass}
      />
    </div>
  );
}


export default Otros;