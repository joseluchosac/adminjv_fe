import Modal from "react-bootstrap/Modal";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { LdsBar, LdsEllipsisCenter } from "./Loaders";
import useLayoutStore from "../store/useLayoutStore";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import useLaboratoriosStore from "../store/useLaboratoriosStore";
import { useMutationLaboratoriosQuery } from "../hooks/useLaboratoriosQuery";
import { Laboratorio } from "../types";

const laboratorioForm_init = {id: 0, nombre: "", estado: 1,}

type Props = {
  onChooseLaboratorio: (laboratorio: Laboratorio) => void
}

export default function LaboratorioFormMdl({onChooseLaboratorio}: Props) {
  const showLaboratorioFormMdl = useLaboratoriosStore(state => state.showLaboratorioFormMdl)
  const currentLaboratorioId = useLaboratoriosStore(state => state.currentLaboratorioId)
  const setShowLaboratorioFormMdl = useLaboratoriosStore(state => state.setShowLaboratorioFormMdl)
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const {
    register, 
    formState: {errors, isDirty}, 
    handleSubmit, 
    reset,
  } = useForm<Laboratorio>({defaultValues: laboratorioForm_init})

  const {
    data: dataGetLaboratorio,
    isPending: isPendingGetLaboratorio,
    isError: isErrorGetLaboratorio,
    getLaboratorio
  } = useMutationLaboratoriosQuery()

  const {
    data: dataMutate,
    isPending: isPendingMutate ,
    createLaboratorio, 
    updateLaboratorio, 
  } = useMutationLaboratoriosQuery()


  const submit = (data: Laboratorio) => {
    Swal.fire({
      icon: 'question',
      text: data.id
        ? `¿Desea guardar los cambios?`
        : `¿Desea registrar a ${data.nombre}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('form_laboratorio'),
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (data.id){
          updateLaboratorio(data)
        }else{
          createLaboratorio(data)
        }
      }
    });
  };

  const resetForm = () => {
    reset(laboratorioForm_init)
  }

  const handleClose = () => {
    setShowLaboratorioFormMdl(false);
  };

  useEffect(() => {
    if(showLaboratorioFormMdl){
      if(currentLaboratorioId){
        getLaboratorio(currentLaboratorioId)
      }
    }else{
      resetForm()
    }
  }, [showLaboratorioFormMdl])

  
  useEffect(() => {
    if(!dataGetLaboratorio) return
    if(dataGetLaboratorio.error){
      toast.error("Error al obtener los datos", {
        autoClose: 3000,
        transition: Bounce,
      })
      setShowLaboratorioFormMdl(false);
    }else{
      if(dataGetLaboratorio){
        reset(dataGetLaboratorio)
      }
    }
  }, [dataGetLaboratorio])

  useEffect(() => {
    if(!isErrorGetLaboratorio) return
    toast.error("Error de conexion", {
      autoClose: 3000,
      transition: Bounce,
    })
    setShowLaboratorioFormMdl(false);
  }, [isErrorGetLaboratorio])

  useEffect(() => {
    if(!dataMutate) return
    if(!dataMutate.error) setShowLaboratorioFormMdl(false);
    onChooseLaboratorio(dataMutate.registro)
    toast(dataMutate.msg, {
      type: dataMutate.msgType,
      autoClose: 3000,
      transition: Bounce,
    })
  }, [dataMutate])

  return (
    <div>
      <Modal show={showLaboratorioFormMdl} onHide={handleClose} backdrop="static" size="md" >
        <Modal.Header closeButton className="py-2">
          <Modal.Title>{currentLaboratorioId ? "Editar laboratorio" : "Nuevo laboratorio"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(submit)} id="form_laboratorio">
            {isPendingMutate && <LdsBar />}
            <Row>
              <Form.Group as={Col} md={12} className="mb-3">
                <Form.Label htmlFor="nombre">Laboratorio</Form.Label>
                <Form.Control
                  id="nombre"
                  {...register('nombre', {
                    required:"El laboratorio es requerido",
                    minLength: {value: 3, message:"Se permite mínimo 3 caracteres"},
                    maxLength: {value: 150, message:"Se permite máximo 150 caracteres"}
                  })}
                />
                {errors.nombre && 
                  <div className="invalid-feedback d-block">{errors.nombre.message}</div>
                }
              </Form.Group>
            </Row>
            <div className="d-flex gap-2 justify-content-end">
              <Button
                onClick={() => resetForm()}
                variant="seccondary"
                type="button"
                hidden={currentLaboratorioId ? true : false}
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
        {isPendingGetLaboratorio && <LdsEllipsisCenter/>}
      </Modal>
    </div>
  );
}

