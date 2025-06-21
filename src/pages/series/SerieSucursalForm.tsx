import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { useSeries } from "./context/SeriesContext";
import { useForm } from "react-hook-form";
import { SerieSucursal } from "../../core/types/catalogosTypes";
import Swal from "sweetalert2";
import useLayoutStore from "../../core/store/useLayoutStore";
import { LdsBar, LdsEllipsisCenter } from "../../core/components/Loaders";
import { useEffect } from "react";
import { useMutationSeriesQuery } from "../../core/hooks/useSeriesQuery";
import { toast } from "react-toastify";
import useCatalogosStore from "../../core/store/useCatalogosStore";

const formInit: SerieSucursal = {
  id: 0,
  establecimiento_id: 0,
  tipo_comprobante_cod: "",
  descripcion: "",
  serie:"",
  correlativo:"",
  modifica_a:"",
  estado:1
}

export default function SerieSucursalForm() {
  const tipos_comprobante = useCatalogosStore(state => state.catalogos?.tipos_comprobante)
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  
  const {
    showForm,
    setShowForm,
    currentSerieSucursalId,
    setCurrentSerieSucursalId,
    currentSucursalId,
    actualizarSerieSucursal,
  } = useSeries()

  const {
    data: serieSucursal,
    isPending: isPendingSerieSucursal,
    getSerieSucursal
  } = useMutationSeriesQuery()

  const {
    data: mutation,
    isPending: isPendingMutation,
    createSerieSucursal,
    updateSerieSucursal,
  } = useMutationSeriesQuery()

  const {
    register, 
    formState: {errors, isDirty}, 
    handleSubmit, 
    reset,
    setValue
  } = useForm<SerieSucursal>({defaultValues: formInit})

  const submit = (serieSucursal: SerieSucursal) => {
    Swal.fire({
      icon: 'question',
      text: serieSucursal.id
        ? `¿Desea guardar los cambios de ${serieSucursal.descripcion}?`
        : `¿Desea registrar a ${serieSucursal.descripcion}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('serie_sucursal_form'),
      customClass: {popup: darkMode ? 'swal-dark' : ''}
    }).then((result) => {
      if (result.isConfirmed) {
        if (serieSucursal.id){
          updateSerieSucursal(serieSucursal)
        }else{
          createSerieSucursal(serieSucursal)
        }
      }
    });
  };

  useEffect(() => {
    if(showForm){
      if(currentSerieSucursalId) {
        getSerieSucursal(currentSerieSucursalId)
      }else{
        setValue('establecimiento_id',currentSucursalId)
      }
    }else{
      reset(formInit)
      setCurrentSerieSucursalId(0)
    }
  }, [showForm])

  useEffect(() => {
    if(!serieSucursal) return
    if(serieSucursal.error){
      toast(serieSucursal.msg, {type: serieSucursal.msgType})
      setShowForm(false);
    }else{
      if(serieSucursal.content) reset(serieSucursal?.content)
    }
  }, [serieSucursal])
  
  useEffect(() => {
    if(!mutation) return
    if(mutation?.content){
      actualizarSerieSucursal(mutation.content)
      setShowForm(false);
    }
    toast(mutation.msg, {type: mutation.msgType})
  }, [mutation])

  return (
    <Modal show={showForm} onHide={()=>setShowForm(false)} backdrop="static" size="md" >
      <Modal.Header closeButton className="py-2">
        <Modal.Title>{currentSerieSucursalId ? "Editar serie" : "Agregar serie"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(submit)} id="serie_sucursal_form">
          {(isPendingMutation) && <LdsBar />}
          <Row>
            <Form.Group as={Col} sm={6} className="mb-3">
              <Form.Label htmlFor="tipo_comprobante_cod">Tipo comprobante</Form.Label>
              <Form.Select
                id="tipo_comprobante_cod"
                {...register('tipo_comprobante_cod',{required: "Ingrese el tipo de comprobante"})}
                onChange={(e)=>{
                  const descripcion = e.target.options[e.target.selectedIndex].textContent || ""
                  setValue("descripcion", descripcion, {shouldDirty: true})
                }}
              >
                {tipos_comprobante && tipos_comprobante.map((el) => 
                  <option key={el.codigo} value={el.codigo}>{el.descripcion}</option>
                )}
              </Form.Select>
              {errors.tipo_comprobante_cod && 
                <div className="invalid-feedback d-block">{errors.tipo_comprobante_cod.message}</div>
              }
            </Form.Group>
            <Form.Group as={Col} sm={6} className="mb-3">
              <Form.Label htmlFor="descripcion">Descripción</Form.Label>
              <Form.Control
                id="descripcion"
                {...register('descripcion', {
                  required:"Ingrese la descripción",
                  minLength: {value: 3, message:"Se permite mínimo 3 caracteres"},
                  maxLength: {value: 100, message:"Se permite máximo 100 caracteres"}
                })}
              />
              {errors.descripcion && 
                <div className="invalid-feedback d-block">{errors.descripcion.message}</div>
              }
            </Form.Group>
            <Form.Group as={Col} sm={3} className="mb-3">
              <Form.Label htmlFor="serie">Serie</Form.Label>
              <Form.Control
                id="serie"
                {...register('serie', {
                  required:"Ingrese la serie de 4 caracteres",
                  minLength: {value: 4, message:"Se permite mínimo 4 caracteres"},
                  maxLength: {value: 4, message:"Se permite mínimo 4 caracteres"}
                })}
              />
              {errors.serie && 
                <div className="invalid-feedback d-block">{errors.serie.message}</div>
              }
            </Form.Group>
            <Form.Group as={Col} sm={4} className="mb-3">
              <Form.Label htmlFor="correlativo">Correlativo</Form.Label>
              <Form.Control
                id="correlativo"
                type="number"
                {...register('correlativo', {
                  required:"Ingrese el correlativo",
                  maxLength: {value: 8, message:"Se permite hasta 8 digitos"},
                  pattern: {
                    value: /^[1-9][0-9]*$/,
                    message: "Solo se permiten números naturales",
                  }
                })}
              />
              {errors.correlativo && 
                <div className="invalid-feedback d-block">{errors.correlativo.message}</div>
              }
            </Form.Group>
            <Form.Group as={Col} sm={5} className="mb-3">
              <Form.Label htmlFor="modifica_a">Modifica a</Form.Label>
              <Form.Select
                id="modifica_a"
                {...register('modifica_a')}
              >
                <option value=""></option>
                {tipos_comprobante && tipos_comprobante.map((el) => 
                  <option key={el.codigo} value={el.codigo}>{el.descripcion}</option>
                )}
              </Form.Select>
            </Form.Group>
          </Row>
          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="seccondary"
              type="button"
              onClick={()=>setShowForm(false)}
            >Cerrar</Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={(isPendingMutation) ? true : isDirty ? false : true}
            >
              {(isPendingMutation) &&
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
      {isPendingSerieSucursal  && <LdsEllipsisCenter/>}
    </Modal>
  )
}
