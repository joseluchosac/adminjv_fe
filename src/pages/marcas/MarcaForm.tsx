import { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { LdsBar, LdsEllipsisCenter } from "../../app/components/Loaders";
import useLayoutStore from "../../app/store/useLayoutStore";
import { useMutationMarcasQuery } from "../../api/queries/useMarcasQuery";
import { Marca, MarcaItem, QueryResp } from "../../app/types";
import useMarcasStore from "../../app/store/useMarcasStore";

const marcaFormInit = {id: 0, nombre: "", estado: 1,}

type MarcaRes = MarcaItem | QueryResp
export function isErrMarcaRes(response: MarcaRes): response is QueryResp {
  return ('error' in response || (response as QueryResp).error == true);
}

type MutationRes = QueryResp & {
  marca?: MarcaItem
};

export default function MarcaForm() {
  const {showMarcaForm, setShowMarcaForm, currentMarcaId} = useMarcasStore()
  const darkMode = useLayoutStore(state => state.layout.darkMode)

  const {
    data: marcaRes,
    isPending: isPendingMarca,
    isError: isErrorMarca,
    getMarca,
  }= useMutationMarcasQuery<MarcaRes>()

  const {
    data: mutation,
    isPending: isPendingMutation,
    isError: isErrorMutation,
    createMarca, 
    updateMarca,
  } = useMutationMarcasQuery<MutationRes>()

  const {
    register, 
    formState: {errors, isDirty}, 
    handleSubmit, 
    reset,
  } = useForm<Marca>({defaultValues: marcaFormInit})

  const submit = (marca: Marca) => {
    Swal.fire({
      icon: 'question',
      text: marca.id
        ? `¿Desea guardar los cambios?`
        : `¿Desea registrar a ${marca.nombre}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('marca_form'),
      customClass: {popup: darkMode ? 'swal-dark' : ''}
    }).then((result) => {
      if (result.isConfirmed) {
        if (marca.id){
          updateMarca(marca)
        }else{
          createMarca(marca)
        }
      }
    });
  };

  useEffect(() => {
    if(showMarcaForm){
      if(currentMarcaId) getMarca(currentMarcaId)
    }else{
      reset(marcaFormInit)
    }
  }, [showMarcaForm])

  useEffect(() => {
    if(!marcaRes) return
    if(isErrMarcaRes(marcaRes)){
      toast.error("Error al obtener la marca");
      setShowMarcaForm({showMarcaForm: false, currentMarcaId: 0});
    }else{
      reset(marcaRes)
    }
  }, [marcaRes])
  
  useEffect(() => {
    if(!mutation) return
    if(!mutation.error) setShowMarcaForm({showMarcaForm: false, currentMarcaId: 0});
    toast(mutation.msg, {type: mutation.msgType})
  }, [mutation])

  useEffect(() => {
    if(!isErrorMarca) return
    toast.error("Error al obtener datos")
    setShowMarcaForm({showMarcaForm: false, currentMarcaId: 0})
  }, [isErrorMarca])

  useEffect(() => {
    if(!isErrorMutation) return
    toast.error("Error al procesar solicitud")
  }, [isErrorMutation])


  return (
    <div>
      <Modal 
        size="md"
        backdrop="static"
        show={showMarcaForm} 
        onHide={()=>setShowMarcaForm({showMarcaForm: false, currentMarcaId: 0})} 
      >
        <Modal.Header closeButton className="py-2">
          <Modal.Title>{currentMarcaId ? "Editar marca" : "Nueva marca"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(submit)} id="marca_form">
            {isPendingMutation && <LdsBar />}
            <Row>
              <Form.Group as={Col} md={12} className="mb-3">
                <Form.Label htmlFor="nombre">Marca</Form.Label>
                <Form.Control
                  id="nombre"
                  {...register('nombre', {
                    required:"Ingrese la marca",
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
                onClick={() => reset(marcaFormInit)}
                variant="seccondary"
                type="button"
                hidden={currentMarcaId ? true : false}
              >Reset</Button>
              <Button
                variant="seccondary"
                type="button"
                onClick={()=>setShowMarcaForm({showMarcaForm: false, currentMarcaId: 0})}
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
        {isPendingMarca  && <LdsEllipsisCenter/>}
      </Modal>
    </div>
  );
}

