import { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { LdsBar, LdsEllipsisCenter } from "../../app/components/Loaders";
import useLayoutStore from "../../app/store/useLayoutStore";
import { MutationLaboratorioRes, useMutationLaboratoriosQuery } from "../../api/queries/useLaboratoriosQuery";
import { Laboratorio, LaboratorioItem, ApiResp } from "../../app/types";
import useLaboratoriosStore from "../../app/store/useLaboratoriosStore";

const laboratorioFormInit = {id: 0, nombre: "", estado: 1,}

type LaboratorioRes = LaboratorioItem | ApiResp
export function isErrLaboratorioRes(response: LaboratorioRes): response is ApiResp {
  return ('error' in response || (response as ApiResp).error == true);
}


export default function LaboratorioForm() {
  const {showLaboratorioForm, setShowLaboratorioForm, currentLaboratorioId} = useLaboratoriosStore()
  const darkMode = useLayoutStore(state => state.layout.darkMode)

  const {
    data: laboratorioRes,
    isPending: isPendingLaboratorio,
    isError: isErrorLaboratorio,
    getLaboratorio,
  } = useMutationLaboratoriosQuery<LaboratorioRes>()

  const {
    data: mutation,
    isPending: isPendingMutation,
    isError: isErrorMutation,
    createLaboratorio, 
    updateLaboratorio,
  } = useMutationLaboratoriosQuery<MutationLaboratorioRes>()

  const {
    register, 
    formState: {errors, isDirty}, 
    handleSubmit, 
    reset,
  } = useForm<Laboratorio>({defaultValues: laboratorioFormInit})

  const submit = (laboratorio: Laboratorio) => {
    Swal.fire({
      icon: 'question',
      text: laboratorio.id
        ? `¿Desea guardar los cambios?`
        : `¿Desea registrar a ${laboratorio.nombre}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('laboratorio_form'),
      customClass: {popup: darkMode ? 'swal-dark' : ''}
    }).then((result) => {
      if (result.isConfirmed) {
        if (laboratorio.id){
          updateLaboratorio(laboratorio)
        }else{
          createLaboratorio(laboratorio)
        }
      }
    });
  };

  useEffect(() => {
    if(showLaboratorioForm){
      if(currentLaboratorioId) getLaboratorio(currentLaboratorioId)
    }else{
      reset(laboratorioFormInit)
    }
  }, [showLaboratorioForm])

  useEffect(() => {
    if(!laboratorioRes) return
    if(isErrLaboratorioRes(laboratorioRes)){
      toast.error("Error al obtener la laboratorio");
      setShowLaboratorioForm({showLaboratorioForm: false, currentLaboratorioId: 0});
    }else{
      reset(laboratorioRes)
    }
  }, [laboratorioRes])
  
  useEffect(() => {
    if(!mutation) return
    if(!mutation.error) setShowLaboratorioForm({showLaboratorioForm: false, currentLaboratorioId: 0});
    toast(mutation.msg, {type: mutation.msgType})
  }, [mutation])

  useEffect(() => {
    if(!isErrorLaboratorio) return
    toast.error("Error al obtener datos")
    setShowLaboratorioForm({showLaboratorioForm: false, currentLaboratorioId: 0})
  }, [isErrorLaboratorio])

  useEffect(() => {
    if(!isErrorMutation) return
    toast.error("Error al procesar solicitud")
  }, [isErrorMutation])


  return (
    <div>
      <Modal 
        size="md"
        backdrop="static"
        show={showLaboratorioForm} 
        onHide={()=>setShowLaboratorioForm({showLaboratorioForm: false, currentLaboratorioId: 0})} 
      >
        <Modal.Header closeButton className="py-2">
          <Modal.Title>{currentLaboratorioId ? "Editar laboratorio" : "Nueva laboratorio"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(submit)} id="laboratorio_form">
            {isPendingMutation && <LdsBar />}
            <Row>
              <Form.Group as={Col} md={12} className="mb-3">
                <Form.Label htmlFor="nombre">Laboratorio</Form.Label>
                <Form.Control
                  id="nombre"
                  {...register('nombre', {
                    required:"Ingrese la laboratorio",
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
                onClick={() => reset(laboratorioFormInit)}
                variant="seccondary"
                type="button"
                hidden={currentLaboratorioId ? true : false}
              >Reset</Button>
              <Button
                variant="seccondary"
                type="button"
                onClick={()=>setShowLaboratorioForm({showLaboratorioForm: false, currentLaboratorioId: 0})}
              >Cerrar</Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isPendingMutation ? true : isDirty ? false : true}
              >
                {isPendingMutation &&
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
        {isPendingLaboratorio  && <LdsEllipsisCenter/>}
      </Modal>
    </div>
  );
}

