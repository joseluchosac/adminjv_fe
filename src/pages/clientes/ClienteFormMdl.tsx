import Modal from "react-bootstrap/Modal";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { LdsBar, LdsEllipsisCenter } from "../../core/components/Loaders";
import useLayoutStore from "../../core/store/useLayoutStore";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";
import useCatalogosStore from "../../core/store/useCatalogosStore";
import { useForm } from "react-hook-form";
import useClientesStore from "../../core/store/useClientesStore";
import {type ClienteForm } from "../../core/types/clientesTypes";
import { useMutationClientesQuery } from "../../core/hooks/useClientesQuery";
const clienteForm_init = {
  id: 0,
  tipo_documento_cod: "0",
  nro_documento: "",
  nombre_razon_social: "",
  direccion: '',
  ubigeo_inei: "",
  email: "",
  telefono: "",
}
type Props = {setTitle: (title:string)=>void;}

function FormCliente({setTitle}: Props){
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
  } = useForm<ClienteForm>({defaultValues: clienteForm_init})

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
  
  const submit = (data: ClienteForm) => {
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

  useEffect(() => {
    if(currentClienteId){
      getCliente((currentClienteId))
      setTitle("Editar cliente")
    }else{
      setTitle("Nuevo cliente")
    }

  }, [])
  
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
        <Form.Group as={Col} md={7} className="mb-3">
          <Form.Label htmlFor="nro_documento">Nro Doc</Form.Label>
          <Form.Control
            id="nro_documento"
            {...register('nro_documento',{
              maxLength: {value: 13, message:"Se permite máximo 13 caracteres"}
            })}
          />
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
              required:"El nombre de usuario es requerido",
              minLength: {value: 3, message:"Se permite mínimo 3 caracteres"},
              maxLength: {value: 50, message:"Se permite máximo 50 caracteres"},
            })}
          />
          {errors.direccion && 
            <div className="invalid-feedback d-block">{errors.direccion.message}</div>
          }
        </Form.Group>
        <Form.Group as={Col} md={12} className="mb-3">
          <Form.Label htmlFor="ubigeo_inei">Ubigeo</Form.Label>
          <Form.Control
            id="ubigeo_inei"
            {...register('ubigeo_inei')}
          />
          {errors.ubigeo_inei && 
            <div className="invalid-feedback d-block">{errors.ubigeo_inei.message}</div>
          }
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

        {Boolean(currentClienteId) && 
          <Button
            variant="danger"
            type="button"
            onClick={handleDelete}
            disabled={isPendingOnMutate ? true : false}
          >Eliminar</Button>
        }
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
  )
}


// CUERPO DEL MODAL
export default function ClienteFormMdl() {
  const showClienteFormMdl = useClientesStore(state => state.showClienteFormMdl)
  const setShowClienteFormMdl = useClientesStore(state => state.setShowClienteFormMdl)
  const [title, setTitle] = useState("");
  const handleClose = () => {
    setShowClienteFormMdl(false);
  };

  return (
      <Modal show={showClienteFormMdl} onHide={handleClose} backdrop="static" size="md" >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body> {showClienteFormMdl && <FormCliente setTitle={setTitle} />} </Modal.Body>
      </Modal>
  );
}

