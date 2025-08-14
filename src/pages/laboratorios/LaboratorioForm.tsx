import { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { LdsBar, LdsEllipsisCenter } from "../../app/components/Loaders";
import useLayoutStore from "../../app/store/useLayoutStore";
import { useMutationLaboratoriosQuery } from "../../api/queries/useLaboratoriosQuery";
import { Laboratorio, QueryResp } from "../../app/types";
import { useLaboratorios } from "./context/LaboratoriosContext";

interface LaboratorioQryRes extends QueryResp {
  content: Laboratorio | null;
}
type GetLaboratorioQuery = {
  data: LaboratorioQryRes | null ;
  isPending: boolean;
  isError: boolean;
  getLaboratorio: (id: number) => void
}

const laboratorioFormInit = {id: 0, nombre: "", estado: 1,}

export default function LaboratorioForm() {
  const {showLaboratorioForm, setShowLaboratorioForm, currentLaboratorioId} = useLaboratorios()
  const darkMode = useLayoutStore(state => state.layout.darkMode)

  const {
    data: laboratorio,
    isPending: isPendingLaboratorio,
    isError: isErrorLaboratorio,
    getLaboratorio,
  }: GetLaboratorioQuery = useMutationLaboratoriosQuery()

  const {
    data: mutation,
    isPending: isPendingMutation,
    isError: isErrorMutation,
    createLaboratorio, 
    updateLaboratorio,
    typeAction,
  } = useMutationLaboratoriosQuery()

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
    if(!laboratorio) return
    console.log(laboratorio)
    if(laboratorio.error){
      toast(laboratorio.msg, {type: laboratorio.msgType})
      setShowLaboratorioForm(false);
    }else{
      if(laboratorio.content) reset(laboratorio?.content)
    }
  }, [laboratorio])
  
  useEffect(() => {
    if(!mutation) return
    if(typeAction==="mutate_laboratorio"){
      if(!mutation.error) setShowLaboratorioForm(false);
      toast(mutation.msg, {type: mutation.msgType})
    }
  }, [mutation])

  useEffect(() => {
    if(!isErrorLaboratorio) return
    toast.error("Error al obtener datos")
    setShowLaboratorioForm(false)
  }, [isErrorLaboratorio])

  useEffect(() => {
    if(!isErrorMutation) return
    toast.error("Error al procesar solicitud")
  }, [isErrorMutation])


  return (
    <div>
      <Modal show={showLaboratorioForm} onHide={()=>setShowLaboratorioForm(false)} backdrop="static" size="md" >
        <Modal.Header closeButton className="py-2">
          <Modal.Title>{currentLaboratorioId ? "Editar laboratorio" : "Nueva laboratorio"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(submit)} id="laboratorio_form">
            {(isPendingMutation && typeAction==="mutate_laboratorio") && <LdsBar />}
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
                onClick={()=>setShowLaboratorioForm(false)}
              >Cerrar</Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={(isPendingMutation && typeAction==="mutate_laboratorio") ? true : isDirty ? false : true}
              >
                {(isPendingMutation && typeAction==="mutate_laboratorio") &&
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

