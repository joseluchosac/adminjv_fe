import { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { LdsBar, LdsEllipsisCenter } from "../../core/components/Loaders";
import useLayoutStore from "../../core/store/useLayoutStore";
import { useMutationMarcasQuery } from "../../core/hooks/useMarcasQuery";
import { Marca } from "../../core/types";
import { useMarcas } from "./context/MarcasContext";

const marcaFrmInit = {id: 0, nombre: "", estado: 1,}

export default function MarcaFrm() {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const {showMarcaFrm, setShowMarcaFrm, currentMarcaId} = useMarcas()
  const {
    data,
    isPending,
    isError,
    getMarca,
    createMarca, 
    updateMarca,
    actionType,
  } = useMutationMarcasQuery()
  const {
    register, 
    formState: {errors, isDirty}, 
    handleSubmit, 
    reset,
  } = useForm<Marca>({defaultValues: marcaFrmInit})

  const submit = (marca: Marca) => {
    Swal.fire({
      icon: 'question',
      text: marca.id
        ? `¿Desea guardar los cambios?`
        : `¿Desea registrar a ${marca.nombre}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('frm_marca'),
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
    if(showMarcaFrm){
      if(currentMarcaId) getMarca(currentMarcaId)
    }else{
      reset(marcaFrmInit)
    }
  }, [showMarcaFrm])

  useEffect(() => {
    if(!data) return
    if(actionType==="getMarca"){
      if(data.error){
        toast.error("Error al obtener los datos", {
          autoClose: 3000, transition: Bounce,
        })
        setShowMarcaFrm(false);
      }else{
        if(data) reset(data)
      }
    }
    if(actionType==="mutation"){
      if(!data.error) setShowMarcaFrm(false);
      toast(data.msg, {
        type: data.msgType, autoClose: 3000, transition: Bounce,
      })
    }
  }, [data])

  useEffect(() => {
    if(!isError) return
    if(actionType==="getMarca"){
      toast.error("Error de conexion", {
        autoClose: 3000, transition: Bounce,
      })
      setShowMarcaFrm(false);
    }
  }, [isError])


  return (
    <div>
      <Modal show={showMarcaFrm} onHide={()=>setShowMarcaFrm(false)} backdrop="static" size="md" >
        <Modal.Header closeButton className="py-2">
          <Modal.Title>{currentMarcaId ? "Editar marca" : "Nuevo marca"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(submit)} id="frm_marca">
            {(isPending && actionType==="mutation") && <LdsBar />}
            <Row>
              <Form.Group as={Col} md={12} className="mb-3">
                <Form.Label htmlFor="nombre">Marca</Form.Label>
                <Form.Control
                  id="nombre"
                  {...register('nombre', {
                    required:"El marca es requerido",
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
                onClick={() => reset(marcaFrmInit)}
                variant="seccondary"
                type="button"
                hidden={currentMarcaId ? true : false}
              >Reset</Button>
              <Button
                variant="seccondary"
                type="button"
                onClick={()=>setShowMarcaFrm(false)}
              >Cerrar</Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={(isPending && actionType==="mutation") ? true : isDirty ? false : true}
              >
                {(isPending && actionType==="mutation") &&
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
        {(isPending && actionType==="getMarca") && <LdsEllipsisCenter/>}
      </Modal>
    </div>
  );
}

