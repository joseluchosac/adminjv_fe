import Modal from "react-bootstrap/Modal";
import { Badge, Button, Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { LdsBar, LdsEllipsisCenter } from "./Loaders";
import useLayoutStore from "../store/useLayoutStore";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";
import useCatalogosStore from "../store/useCatalogosStore";
import { useForm } from "react-hook-form";
import useClientesStore from "../store/useClientesStore";
import {type Cliente } from "../types/clientesTypes";
import { useMutationClientesQuery } from "../hooks/useClientesQuery";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import UbigeosMdl from "./UbigeosMdl";
import { Ubigeo } from "../types";
const clienteForm_init = {
  id: 0,
  tipo_documento_cod: "0",
  tipo_documento: "",
  nro_documento: "",
  nombre_razon_social: "",
  direccion: '',
  ubigeo_inei: "",
  departamento: "",
  provincia: "",
  distrito: "",
  email: "",
  telefono: "",
  api: 0,
  estado: 1,
}
type Props = {
  onChooseCliente: (cliente: Cliente) => void
}

export default function ClienteFormMdl({onChooseCliente}: Props) {
  const showClienteFormMdl = useClientesStore(state => state.showClienteFormMdl)
  const [lugar, setLugar] = useState("");
  const [showUbigeos, setShowUbigeos] = useState(false)
  const currentClienteId = useClientesStore(state => state.currentClienteId)
  const setShowClienteFormMdl = useClientesStore(state => state.setShowClienteFormMdl)
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const catalogos = useCatalogosStore(state => state.catalogos)
  const {
    register, 
    formState: {errors, isDirty}, 
    handleSubmit, 
    reset,
    // watch,
    getValues,
    setValue,
  } = useForm<Cliente>({defaultValues: clienteForm_init})

  const {
    data: dataGetCliente,
    isPending: isPendingGetCliente,
    isError: isErrorGetCliente,
    getCliente
  } = useMutationClientesQuery()

  const {
    data: dataMutate,
    isPending: isPendingMutate ,
    createCliente, 
    updateCliente, 
  } = useMutationClientesQuery()

  const {
    data: dataConsultarNroDocumento,
    isPending: isPendingConsultarNroDocumento ,
    consultarNroDocumento,
    reset: resetDataConsultarNroDocumento
  } = useMutationClientesQuery()

  const onChooseUbigeo = (ubigeo: Ubigeo) => {
    setShowUbigeos(false)
    setLugar(`${ubigeo.distrito} - ${ubigeo.provincia} - ${ubigeo.departamento}`)
    setValue("ubigeo_inei", ubigeo.ubigeo_inei,{shouldDirty: true})
  }

  const handleConsultarNroDocumento = () => {
    const {tipo_documento_cod, nro_documento, api} = getValues()
    if(tipo_documento_cod == "1" || tipo_documento_cod == "6"){
      consultarNroDocumento({tipo_documento_cod, nro_documento, api})
    }else{
      toast("No se puede consultar este número de documento", {
        type: "warning",
        autoClose: 3000,
        transition: Bounce,
      })
    }
  }

  const submit = (data: Cliente) => {
    Swal.fire({
      icon: 'question',
      text: data.id
        ? `¿Desea guardar los cambios de ${data.nombre_razon_social}?`
        : `¿Desea registrar a ${data.nombre_razon_social}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('frm_cliente'),
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (data.id){
          updateCliente(data)
        }else{
          createCliente(data)
        }
      }
    });
  };

  const resetForm = () => {
    reset(clienteForm_init)
    resetDataConsultarNroDocumento(null)
    setLugar("")
  }

  const handleClose = () => {
    setShowClienteFormMdl(false);
  };

  useEffect(() => {
    if(showClienteFormMdl){
      if(currentClienteId){
        getCliente(currentClienteId)
      }
    }else{
      resetForm()
    }
  }, [showClienteFormMdl])

  useEffect(() => {
    if(!dataConsultarNroDocumento) return
    if(!dataConsultarNroDocumento.error){
      const {tipoDocumento, nombre_razon_social} = dataConsultarNroDocumento
      setValue("nombre_razon_social", nombre_razon_social)
      setValue("api", 1)
      if(tipoDocumento == "1"){
        setLugar("")
        setValue("direccion", "")
        setValue("ubigeo_inei", "",{shouldDirty: true})
      }else if(tipoDocumento == "6"){
        const {ubigeo, departamento, provincia, distrito, direccion} = dataConsultarNroDocumento
        setLugar(`${distrito} - ${provincia} - ${departamento}`)
        setValue("direccion", direccion)
        setValue("ubigeo_inei", ubigeo,{shouldDirty: true})
      }
    }else{
      setValue("nombre_razon_social", "")
      setValue("api", 0)
      setLugar("")
      setValue("direccion", "")
      setValue("ubigeo_inei", "",{shouldDirty: true})
      toast(dataConsultarNroDocumento.msg, {
        type: dataConsultarNroDocumento.msgType,
        autoClose: 3000,
        transition: Bounce,
      })
    }
  }, [dataConsultarNroDocumento])
  
  useEffect(() => {
    if(!dataGetCliente) return
    if(dataGetCliente.error){
      toast.error("Error al obtener los datos", {
        autoClose: 3000,
        transition: Bounce,
      })
      setShowClienteFormMdl(false);
    }else{
      if(dataGetCliente){
        reset(dataGetCliente)
        setLugar(`${dataGetCliente.distrito} - ${dataGetCliente.provincia} - ${dataGetCliente.departamento}`)

      }
    }
  }, [dataGetCliente])

  useEffect(() => {
    if(!isErrorGetCliente) return
    toast.error("Error de conexion", {
      autoClose: 3000,
      transition: Bounce,
    })
    setShowClienteFormMdl(false);
  }, [isErrorGetCliente])

  useEffect(() => {
    if(!dataMutate) return
    if(!dataMutate.error) setShowClienteFormMdl(false);
    onChooseCliente(dataMutate.registro)
    toast(dataMutate.msg, {
      type: dataMutate.msgType,
      autoClose: 3000,
      transition: Bounce,
    })
  }, [dataMutate])

  return (
    <div>
      <Modal show={showClienteFormMdl} onHide={handleClose} backdrop="static" size="md" >
        <Modal.Header closeButton>
          <Modal.Title>{currentClienteId ? "Editar cliente" : "Nuevo cliente"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(submit)} id="frm_cliente">
            {isPendingMutate && <LdsBar />}
            {isPendingConsultarNroDocumento && <LdsBar />}
            <Row>
              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label htmlFor="tipo_documento_cod">Tipo</Form.Label>
                <Form.Select
                  id="tipo_documento_cod"
                  {...register('tipo_documento_cod',{valueAsNumber:true})}
                  disabled={dataConsultarNroDocumento?.nombre_razon_social || currentClienteId 
                    ? true : false
                  }
                >
                  {catalogos?.tipos_documento.map((el) => 
                    <option key={el.id} value={el.codigo}>{el.descripcion}</option>
                  )}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} md={8} className="mb-3">
                <Form.Label htmlFor="nro_documento" className="d-flex justify-content-between">
                  <div>Nro Doc</div>
                  { dataConsultarNroDocumento &&
                    <Badge bg={dataConsultarNroDocumento?.estado == "ACTIVO" ? "success" : "warning"}>
                      {dataConsultarNroDocumento?.estado}
                    </Badge>
                  }
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    id="nro_documento"
                    {...register('nro_documento',{
                      maxLength: {value: 13, message:"Se permite máximo 13 caracteres"}
                    })}
                    disabled={dataConsultarNroDocumento?.nombre_razon_social || currentClienteId 
                      ? true : false
                    }
                  />
                  <Button onClick={handleConsultarNroDocumento} variant="outline-secondary" title="Consultar nro. de documento">
                    <FaSearch />
                  </Button>
                </InputGroup>
                {errors.nro_documento && 
                  <div className="invalid-feedback d-block">{errors.nro_documento.message}</div>
                }        </Form.Group>
              <Form.Group as={Col} md={12} className="mb-3">
                <Form.Label htmlFor="nombre_razon_social">Nombre o Razón Social</Form.Label>
                <Form.Control
                  id="nombre_razon_social"
                  {...register('nombre_razon_social', {
                    required:"El nombre o Razón Social son requeridos",
                    minLength: {value: 3, message:"Se permite mínimo 3 caracteres"},
                    maxLength: {value: 150, message:"Se permite máximo 150 caracteres"}
                  })}
                  disabled={dataConsultarNroDocumento?.nombre_razon_social ? true : false}
                />
                {errors.nombre_razon_social && 
                  <div className="invalid-feedback d-block">{errors.nombre_razon_social.message}</div>
                }
              </Form.Group>
              <Form.Group as={Col} md={12} className="mb-3">
                <Form.Label htmlFor="direccion" className="d-flex justify-content-between">
                  <div>Dirección</div>
                  { dataConsultarNroDocumento &&
                    <Badge bg={dataConsultarNroDocumento?.condicion == "HABIDO" ? "success" : "warning"}>
                      {dataConsultarNroDocumento?.condicion}
                    </Badge>
                  }
                </Form.Label>
                <Form.Control
                  id="direccion"
                  {...register('direccion', {
                    minLength: {value: 3, message:"Se permite mínimo 3 caracteres"},
                    maxLength: {value: 150, message:"Se permite máximo 150 caracteres"},
                  })}
                  disabled={dataConsultarNroDocumento?.direccion ? true : false}
                />
                {errors.direccion && 
                  <div className="invalid-feedback d-block">{errors.direccion.message}</div>
                }
              </Form.Group>
              <Form.Group as={Col} md={12} className="mb-3">
                <Form.Label htmlFor="lugar">Ubigeo</Form.Label>
                <InputGroup>
                  <Form.Control
                    id="lugar"
                    title={lugar}
                    value={lugar}
                    disabled={dataConsultarNroDocumento?.ubigeo ? true : false}
                    readOnly
                  />
                  <Button 
                    variant="outline-secondary" 
                    title="Eliminar ubigeo"
                    disabled={dataConsultarNroDocumento?.ubigeo ? true : false}
                    >
                    <FaTrash />
                  </Button>
                  <Button 
                    onClick={() => setShowUbigeos(true)} 
                    variant="outline-secondary" 
                    title="Seleccionar ubigeo"
                    disabled={dataConsultarNroDocumento?.ubigeo ? true : false}
                  >
                    <FaEdit />
                  </Button>
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  type="text"
                  id="email"
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Formato de email no valido'
                    }
                  })}
                />
                {errors.email && 
                  <div className="invalid-feedback d-block">{errors.email.message}</div>
                }        
              </Form.Group>
              <Form.Group as={Col} md={6} xl={4} className="mb-3">
                <Form.Label htmlFor="telefono">Teléfono</Form.Label>
                <Form.Control
                  id="telefono"
                  {...register('telefono')}
                />
                {errors.telefono && 
                  <div className="invalid-feedback d-block">{errors.telefono.message}</div>
                }
              </Form.Group>
            </Row>
            <div className="d-flex gap-2 justify-content-end">
              <Button
                onClick={() => resetForm()}
                variant="seccondary"
                type="button"
                hidden={currentClienteId ? true : false}
              >Reset</Button>
              <Button
                variant="seccondary"
                type="button"
                onClick={handleClose}
              >Cerrar</Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isPendingMutate ? true : isDirty ? false : true}
              >
                {isPendingMutate &&
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                }
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
        {isPendingGetCliente && <LdsEllipsisCenter/>}
      </Modal>
      <UbigeosMdl
        show={showUbigeos} 
        setShow={setShowUbigeos}
        onChooseUbigeo={onChooseUbigeo}
      />
    </div>
  );
}

