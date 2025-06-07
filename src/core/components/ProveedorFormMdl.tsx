import Modal from "react-bootstrap/Modal";
import { Badge, Button, Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { LdsBar, LdsEllipsisCenter } from "./Loaders";
import useLayoutStore from "../store/useLayoutStore";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useCatalogosStore from "../store/useCatalogosStore";
import { useForm } from "react-hook-form";
import useProveedoresStore from "../store/useProveedoresStore";
import { useMutationProveedoresQuery } from "../hooks/useProveedoresQuery";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import UbigeosMdl from "./UbigeosMdl";
import { Ubigeo } from "../types/catalogosTypes";
import { Proveedor } from "../types";
const proveedorForm_init = {
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
  onChooseProveedor: (proveedor: Proveedor) => void
}

export default function ProveedorFormMdl({onChooseProveedor}: Props) {
  const showProveedorFormMdl = useProveedoresStore(state => state.showProveedorFormMdl)
  const [lugar, setLugar] = useState("");
  const [showUbigeos, setShowUbigeos] = useState(false)
  const currentProveedorId = useProveedoresStore(state => state.currentProveedorId)
  const setShowProveedorFormMdl = useProveedoresStore(state => state.setShowProveedorFormMdl)
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const catalogos = useCatalogosStore(state => state.catalogos)
  const {
    register, 
    formState: {errors, isDirty}, 
    handleSubmit, 
    reset,
    getValues,
    setValue,
  } = useForm<Proveedor>({defaultValues: proveedorForm_init})

  const {
    data: proveedor,
    isPending: isPendingGetProveedor,
    isError: isErrorGetProveedor,
    getProveedor
  } = useMutationProveedoresQuery()

  const {
    data: dataMutate,
    isPending: isPendingMutate ,
    createProveedor, 
    updateProveedor, 
  } = useMutationProveedoresQuery()

  const {
    data: dataConsultarNroDocumento,
    isPending: isPendingConsultarNroDocumento ,
    consultarNroDocumento,
    reset: resetDataConsultarNroDocumento
  } = useMutationProveedoresQuery()

  const onChooseUbigeo = (ubigeo: Ubigeo) => {
    setShowUbigeos(false)
    setLugar(`${ubigeo.departamento} - ${ubigeo.provincia} - ${ubigeo.distrito}`)
    setValue("ubigeo_inei", ubigeo.ubigeo_inei,{shouldDirty: true})
  }
  
  const clearUbigeo = () => {
    setLugar("")
    setValue("ubigeo_inei", "",{shouldDirty: true})
  }

  const handleConsultarNroDocumento = () => {
    const {tipo_documento_cod, nro_documento, api} = getValues()
    if(tipo_documento_cod == "1" || tipo_documento_cod == "6"){
      consultarNroDocumento({tipo_documento_cod, nro_documento, api})
    }else{
      toast("No se puede consultar este número de documento", {type: "warning"})
    }
  }

  const submit = (data: Proveedor) => {
    Swal.fire({
      icon: 'question',
      text: data.id
        ? `¿Desea guardar los cambios de ${data.nombre_razon_social}?`
        : `¿Desea registrar a ${data.nombre_razon_social}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('form_proveedor'),
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (data.id){
          updateProveedor(data)
        }else{
          createProveedor(data)
        }
      }
    });
  };

  const resetForm = () => {
    reset(proveedorForm_init)
    resetDataConsultarNroDocumento(null)
    setLugar("")
  }

  const handleClose = () => {
    setShowProveedorFormMdl(false);
  };

  useEffect(() => {
    if(showProveedorFormMdl){
      if(currentProveedorId){
        getProveedor(currentProveedorId)
      }
    }else{
      resetForm()
    }
  }, [showProveedorFormMdl])

  useEffect(() => {
    if(!dataConsultarNroDocumento) return
    if(!dataConsultarNroDocumento.error){
      const {tipoDocumento, nombre_razon_social} = dataConsultarNroDocumento.content
      setValue("nombre_razon_social", nombre_razon_social)
      setValue("api", 1)
      if(tipoDocumento == "1"){
        setLugar("")
        setValue("direccion", "")
        setValue("ubigeo_inei", "",{shouldDirty: true})
      }else if(tipoDocumento == "6"){
        const {ubigeo, departamento, provincia, distrito, direccion} = dataConsultarNroDocumento.content
        setLugar(`${departamento} - ${provincia} - ${distrito}`)
        setValue("direccion", direccion)
        setValue("ubigeo_inei", ubigeo,{shouldDirty: true})
      }
    }else{
      setValue("nombre_razon_social", "")
      setValue("api", 0)
      setLugar("")
      setValue("direccion", "")
      setValue("ubigeo_inei", "",{shouldDirty: true})
      toast(dataConsultarNroDocumento.msg, {type: dataConsultarNroDocumento.msgType})
    }
  }, [dataConsultarNroDocumento])
  
  useEffect(() => {
    if(!proveedor) return
    if(proveedor.error){
      toast.error("Error al obtener los datos")
      setShowProveedorFormMdl(false);
    }else{
      if(proveedor.content){
        reset(proveedor.content)
        setLugar(`${proveedor.content.departamento} - ${proveedor.content.provincia} - ${proveedor.content.distrito}`)

      }
    }
  }, [proveedor])

  useEffect(() => {
    if(!isErrorGetProveedor) return
    toast.error("Error de conexion")
    setShowProveedorFormMdl(false);
  }, [isErrorGetProveedor])

  useEffect(() => {
    if(!dataMutate) return
    if(!dataMutate.error) setShowProveedorFormMdl(false);
    onChooseProveedor(dataMutate.content)
    toast(dataMutate.msg, {type: dataMutate.msgType})
  }, [dataMutate])

  return (
    <div>
      <Modal show={showProveedorFormMdl} onHide={handleClose} backdrop="static" size="md" >
        <Modal.Header closeButton className="py-2">
          <Modal.Title>{currentProveedorId ? "Editar proveedor" : "Nuevo proveedor"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(submit)} id="form_proveedor">
            {isPendingMutate && <LdsBar />}
            {isPendingConsultarNroDocumento && <LdsBar />}
            <Row>
              <Form.Group as={Col} md={4} className="mb-3">
                <Form.Label htmlFor="tipo_documento_cod">Tipo</Form.Label>
                <Form.Select
                  id="tipo_documento_cod"
                  {...register('tipo_documento_cod',{valueAsNumber:true})}
                  disabled={dataConsultarNroDocumento?.content.nombre_razon_social || currentProveedorId 
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
                  { dataConsultarNroDocumento?.content &&
                    <Badge bg={dataConsultarNroDocumento?.content.estado == "ACTIVO" ? "success" : "warning"}>
                      {dataConsultarNroDocumento?.content.estado}
                    </Badge>
                  }
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    id="nro_documento"
                    {...register('nro_documento',{
                      maxLength: {value: 13, message:"Se permite máximo 13 caracteres"}
                    })}
                    disabled={dataConsultarNroDocumento?.content.nombre_razon_social || currentProveedorId 
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
                  disabled={dataConsultarNroDocumento?.content.nombre_razon_social ? true : false}
                />
                {errors.nombre_razon_social && 
                  <div className="invalid-feedback d-block">{errors.nombre_razon_social.message}</div>
                }
              </Form.Group>
              <Form.Group as={Col} md={12} className="mb-3">
                <Form.Label htmlFor="direccion" className="d-flex justify-content-between">
                  <div>Dirección</div>
                  { dataConsultarNroDocumento?.content &&
                    <Badge bg={dataConsultarNroDocumento?.content.condicion == "HABIDO" ? "success" : "warning"}>
                      {dataConsultarNroDocumento?.content.condicion}
                    </Badge>
                  }
                </Form.Label>
                <Form.Control
                  id="direccion"
                  {...register('direccion', {
                    minLength: {value: 3, message:"Se permite mínimo 3 caracteres"},
                    maxLength: {value: 150, message:"Se permite máximo 150 caracteres"},
                  })}
                  disabled={dataConsultarNroDocumento?.content.direccion ? true : false}
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
                    disabled={dataConsultarNroDocumento?.content.ubigeo ? true : false}
                    readOnly
                  />
                  <Button 
                    onClick={clearUbigeo}
                    variant="outline-secondary" 
                    title="Eliminar ubigeo"
                    disabled={dataConsultarNroDocumento?.content.ubigeo ? true : false}
                    >
                    <FaTrash />
                  </Button>
                  <Button 
                    onClick={() => setShowUbigeos(true)} 
                    variant="outline-secondary" 
                    title="Seleccionar ubigeo"
                    disabled={dataConsultarNroDocumento?.content.ubigeo ? true : false}
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
                hidden={currentProveedorId ? true : false}
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
        {isPendingGetProveedor && <LdsEllipsisCenter/>}
      </Modal>
      <UbigeosMdl
        show={showUbigeos} 
        setShow={setShowUbigeos}
        onChooseUbigeo={onChooseUbigeo}
      />
    </div>
  );
}

