import Modal from "react-bootstrap/Modal";
import { Button, Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";
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
  estado: 1,
}
type Props = {
  onChooseCliente: (cliente: Cliente) => void
}

export default function ClienteFormMdl({onChooseCliente}: Props) {
  const showClienteFormMdl = useClientesStore(state => state.showClienteFormMdl)
  const [title, setTitle] = useState("");
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
    watch,
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
    data: dataOnMutate,
    isPending: isPendingOnMutate ,
    createCliente, 
    updateCliente, 
    deleteCliente, 
  } = useMutationClientesQuery()

  const onChooseUbigeo = (ubigeo: Ubigeo) => {
    setShowUbigeos(false)
    setValue("departamento", ubigeo.departamento)
    setValue("provincia", ubigeo.provincia)
    setValue("distrito", ubigeo.distrito)
    setValue("ubigeo_inei", ubigeo.ubigeo_inei,{shouldDirty: true})
  }

  const handleChooseCliente = () => {
    // onChooseCliente(clienteForm_init)
  }
  const submit = (data: Cliente) => {
    console.log(data)
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

  const handleDelete = () => {
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar a ${watch("nombre_razon_social")}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('frm_cliente'),
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCliente(currentClienteId)
      }
    });
  }

  const handleClose = () => {
    setShowClienteFormMdl(false);
  };

  // useEffect(() => {
    // }, [])
    useEffect(() => {
      if(showClienteFormMdl){
        if(currentClienteId){
          getCliente(currentClienteId)
          setTitle("Editar cliente")
        }else{
          setTitle("Nuevo cliente")
        }
      }else{
        reset(clienteForm_init)
      }
    }, [showClienteFormMdl])
  
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
    if(!dataOnMutate) return
    if(!dataOnMutate.error) setShowClienteFormMdl(false);
    toast(dataOnMutate.msg, {
      type: dataOnMutate.msgType,
      autoClose: 3000,
      transition: Bounce,
    })
  }, [dataOnMutate])

  return (
    <div>
      <Modal show={showClienteFormMdl} onHide={handleClose} backdrop="static" size="md" >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleSubmit(submit)} id="frm_cliente">
          {isPendingOnMutate && <LdsBar />}
          <Row>
            <Form.Group as={Col} md={4} className="mb-3">
              <Form.Label htmlFor="tipo_documento_cod">Tipo</Form.Label>
              <Form.Select
                id="tipo_documento_cod"
                {...register('tipo_documento_cod',{valueAsNumber:true})}
              >
                {catalogos?.tipos_documento.map((el) => 
                  <option key={el.id} value={el.codigo}>{el.descripcion}</option>
                )}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} md={8} className="mb-3">
              <Form.Label htmlFor="nro_documento">Nro Doc</Form.Label>
              <InputGroup>
                <Form.Control
                  id="nro_documento"
                  {...register('nro_documento',{
                    maxLength: {value: 13, message:"Se permite máximo 13 caracteres"}
                  })}
                />
                <Button variant="outline-secondary" title="Consultar nro. de documento"><FaSearch /></Button>
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
                  maxLength: {value: 50, message:"Se permite máximo 50 caracteres"}
                })}
              />
              {errors.nombre_razon_social && 
                <div className="invalid-feedback d-block">{errors.nombre_razon_social.message}</div>
              }
            </Form.Group>
            <Form.Group as={Col} md={12} className="mb-3">
              <Form.Label htmlFor="direccion">Dirección</Form.Label>
              <Form.Control
                id="direccion"
                {...register('direccion', {
                  minLength: {value: 3, message:"Se permite mínimo 3 caracteres"},
                  maxLength: {value: 50, message:"Se permite máximo 50 caracteres"},
                })}
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
                  title="san martin"
                  value={getValues().ubigeo_inei
                    ? `${getValues().distrito} - ${getValues().provincia} - ${getValues().departamento}`
                    : ""
                  }
                  readOnly
                />
                <Button variant="outline-secondary" title="Eliminar ubigeo">
                  <FaTrash />
                </Button>
                <Button onClick={() => setShowUbigeos(true)} variant="outline-secondary" title="Seleccionar ubigeo">
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
              variant="seccondary"
              type="button"
              onClick={handleClose}
            >Cerrar</Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={isPendingOnMutate ? true : isDirty ? false : true}
            >
              {isPendingOnMutate &&
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
          {isPendingGetCliente && <LdsEllipsisCenter/>}
        </Form>
        </Modal.Body>
      </Modal>
      <UbigeosMdl
        show={showUbigeos} 
        setShow={setShowUbigeos}
        onChooseUbigeo={onChooseUbigeo}
      />
    </div>
  );
}

