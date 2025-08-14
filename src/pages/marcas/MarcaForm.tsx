import { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { LdsBar, LdsEllipsisCenter } from "../../app/components/Loaders";
import useLayoutStore from "../../app/store/useLayoutStore";
import { useMutationMarcasQuery } from "../../api/queries/useMarcasQuery";
import { Marca, QueryResp } from "../../app/types";
import { useMarcas } from "./context/MarcasContext";

interface MarcaQryRes extends QueryResp {
  content: Marca | null;
}
type GetMarcaQuery = {
  data: MarcaQryRes | null ;
  isPending: boolean;
  isError: boolean;
  getMarca: (id: number) => void
}

const marcaFormInit = {id: 0, nombre: "", estado: 1,}

export default function MarcaForm() {
  const {showMarcaForm, setShowMarcaForm, currentMarcaId} = useMarcas()
  const darkMode = useLayoutStore(state => state.layout.darkMode)

  const {
    data: marca,
    isPending: isPendingMarca,
    isError: isErrorMarca,
    getMarca,
  }: GetMarcaQuery = useMutationMarcasQuery()

  const {
    data: mutation,
    isPending: isPendingMutation,
    isError: isErrorMutation,
    createMarca, 
    updateMarca,
    typeAction,
  } = useMutationMarcasQuery()

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
    if(!marca) return
    console.log(marca)
    if(marca.error){
      toast(marca.msg, {type: marca.msgType})
      setShowMarcaForm(false);
    }else{
      if(marca.content) reset(marca?.content)
    }
  }, [marca])
  
  useEffect(() => {
    if(!mutation) return
    if(typeAction==="mutate_marca"){
      if(!mutation.error) setShowMarcaForm(false);
      toast(mutation.msg, {type: mutation.msgType})
    }
  }, [mutation])

  useEffect(() => {
    if(!isErrorMarca) return
    toast.error("Error al obtener datos")
    setShowMarcaForm(false)
  }, [isErrorMarca])

  useEffect(() => {
    if(!isErrorMutation) return
    toast.error("Error al procesar solicitud")
  }, [isErrorMutation])


  return (
    <div>
      <Modal show={showMarcaForm} onHide={()=>setShowMarcaForm(false)} backdrop="static" size="md" >
        <Modal.Header closeButton className="py-2">
          <Modal.Title>{currentMarcaId ? "Editar marca" : "Nueva marca"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(submit)} id="marca_form">
            {(isPendingMutation && typeAction==="mutate_marca") && <LdsBar />}
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
                onClick={()=>setShowMarcaForm(false)}
              >Cerrar</Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={(isPendingMutation && typeAction==="mutate_marca") ? true : isDirty ? false : true}
              >
                {(isPendingMutation && typeAction==="mutate_marca") &&
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

