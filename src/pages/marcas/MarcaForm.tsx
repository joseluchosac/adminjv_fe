import { useEffect, useMemo } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { LdsBar, LdsEllipsisCenter } from "../../app/components/Loaders";
import useLayoutStore from "../../app/store/useLayoutStore";
import { useMutationMarcasQuery } from "../../api/queries/useMarcasQuery";
import { Marca, MarcaItem, ApiResp } from "../../app/types";
import { useLocation, useNavigate } from "react-router-dom";

const marcaFormInit = {id: 0, nombre: "", estado: 1,}

type MarcaRes = MarcaItem | ApiResp
export function isErrMarcaRes(response: MarcaRes): response is ApiResp {
  return ('error' in response || (response as ApiResp).error == true);
}

type MutationRes = ApiResp & {
  marca?: MarcaItem
};

export default function MarcaForm() {
  const navigate = useNavigate()
  const location = useLocation()
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

  const id = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('edit')
  }, [location]);

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

  const handleClose = () => {
    navigate(location.pathname)
  };
    
  useEffect(() => {
    if(!id) return reset(marcaFormInit)
    if(+id || 0){
      getMarca(+id)
    }else{
      reset(marcaFormInit)
    }
  }, [id]);

  useEffect(() => {
    if(!marcaRes) return
    if(isErrMarcaRes(marcaRes)){
      toast.error("Error al obtener la marca");
      handleClose();
    }else{
      reset(marcaRes)
    }
  }, [marcaRes])
  
  useEffect(() => {
    if(!mutation) return
    if(!mutation.error) handleClose();
    toast(mutation.msg, {type: mutation.msgType})
  }, [mutation])

  useEffect(() => {
    if(!isErrorMarca) return
    toast.error("Error al obtener datos")
    handleClose()
  }, [isErrorMarca])

  useEffect(() => {
    if(!isErrorMutation) return
    toast.error("Error al procesar solicitud")
  }, [isErrorMutation])


  return (
    <div>
      <Modal 
        show={!!id}
        size="lg"
        backdrop="static"
        onHide={handleClose} 
      >
        <Modal.Header closeButton className="py-2">
          <Modal.Title>{(id && +id) ? "Editar marca" : "Nueva marca"}</Modal.Title>
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
                hidden={(id && +id) ? true : false}
              >Reset</Button>
              <Button
                variant="seccondary"
                type="button"
                onClick={handleClose}
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

