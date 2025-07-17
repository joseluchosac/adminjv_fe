import { Button, Col, Form, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { useNumeraciones } from "./context/NumeracionesContext";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useLayoutStore from "../../core/store/useLayoutStore";
import { LdsBar, LdsEllipsisCenter } from "../../core/components/Loaders";
import { useEffect } from "react";
import { useMutationNumeracionesQuery } from "../../core/hooks/useNumeracionesQuery";
import { toast } from "react-toastify";
import { Numeracion } from "../../core/types";
import { useTiposComprobanteQuery } from "../../core/hooks/useCatalogosQuery";

const formInit: Numeracion = {
  id: 0,
  establecimiento_id: 0,
  descripcion_doc: "",
  serie_pre: "",
  serie_suf: "",
  serie:"",
  correlativo:0,
  estado:1
}

export default function NumeracionForm() {
  const {tiposComprobante} = useTiposComprobanteQuery()
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const {
    setNumeracion,
    showForm,
    setShowForm,
    currentNumeracionId,
    setCurrentNumeracionId,
    currentEstablecimientoId,
  } = useNumeraciones()

  const {
    data: numeracion,
    isPending: isPendingNumeracion,
    getNumeracion
  } = useMutationNumeracionesQuery()

  const {
    data: mutation,
    isPending: isPendingMutation,
    createNumeracion,
    updateNumeracion,
  } = useMutationNumeracionesQuery()

  const {
    register, 
    formState: {errors, isDirty}, 
    handleSubmit, 
    reset,
    setValue,
    getValues,
    watch,

  } = useForm<Numeracion>({defaultValues: formInit})

  const submit = (numeracionEstablecimiento: Numeracion) => {
    // console.log(numeracionEstablecimiento)
    // return
    Swal.fire({
      icon: 'question',
      text: numeracionEstablecimiento.id
        ? `¿Desea guardar los cambios de ${numeracionEstablecimiento.descripcion_doc}?`
        : `¿Desea registrar la numeración de ${numeracionEstablecimiento.descripcion_doc}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('numeracion_establecimiento_form'),
      customClass: {popup: darkMode ? 'swal-dark' : ''}
    }).then((result) => {
      if (result.isConfirmed) {
        if (numeracionEstablecimiento.id){
          updateNumeracion(numeracionEstablecimiento)
        }else{
          createNumeracion(numeracionEstablecimiento)
        }
      }
    });
  };

  useEffect(() => {
    if(showForm){
      if(currentNumeracionId) {
        getNumeracion(currentNumeracionId)
      }else{
        setValue('establecimiento_id',currentEstablecimientoId)
      }
    }else{
      reset(formInit)
      setCurrentNumeracionId(0)
    }
  }, [showForm])

  useEffect(() => {
    if(!numeracion) return
    if(numeracion.error){
      toast(numeracion.msg, {type: numeracion.msgType})
      setShowForm(false);
    }else{
      if(numeracion.content)
        reset(numeracion?.content)
    }
  }, [numeracion])
  
  useEffect(() => {
    if(!mutation) return
    if(!mutation.error) setShowForm(false)
    if(mutation?.content){
      setNumeracion(mutation.content)
    }
    toast(mutation.msg, {type: mutation.msgType})
  }, [mutation])

  useEffect(() => {
    setValue('serie', `${getValues().serie_pre}${getValues().serie_suf}`)
    if(!tiposComprobante) return
    const tipo_comprobante = tiposComprobante?.find(el => el.serie_pre === getValues().serie_pre)
    setValue('descripcion_doc', tipo_comprobante ? tipo_comprobante.descripcion_doc : "")
  }, [watch("serie_pre"), watch("serie_suf")])

  return (
    <Modal show={showForm} onHide={()=>setShowForm(false)} backdrop="static" size="md" >
      <Modal.Header closeButton className="py-2">
        <Modal.Title>{currentNumeracionId ? "Editar numeración" : "Agregar numeración"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(submit)} id="numeracion_establecimiento_form">
          {(isPendingMutation) && <LdsBar />}
          <Row>
            <Form.Group as={Col} sm={8} className="mb-3">
              <Form.Label htmlFor="serie_pre">Tipo comprobante</Form.Label>
              <Form.Select
                id="serie_pre"
                {...register('serie_pre',{required: "Ingrese el tipo de comprobante"})}
              >
                {tiposComprobante && tiposComprobante.map((el) => 
                  <option key={el.id} value={el.serie_pre}>{el.descripcion_doc}</option>
                )}
              </Form.Select>
              {errors.serie_pre && 
                <div className="invalid-feedback d-block">{errors.serie_pre.message}</div>
              }
            </Form.Group>
            <Form.Group as={Col} sm={4} className="mb-3">
              <Form.Label htmlFor="serie_suf">Serie</Form.Label>
              <InputGroup>
                <InputGroup.Text>{watch("serie_pre")}</InputGroup.Text>
                <Form.Control
                  id="serie_suf"
                  {...register('serie_suf', {
                    required:"Ingrese la serie de 4 caracteres",
                    minLength: {value: 4-watch("serie_pre").length, message:"Se permite mínimo 4 caracteres"},
                    maxLength: {value: 4-watch("serie_pre").length, message:"Se permite mínimo 4 caracteres"}
                  })}
                />
              </InputGroup>
              {errors.serie_suf && 
                <div className="invalid-feedback d-block">{errors.serie_suf.message}</div>
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
      {isPendingNumeracion  && <LdsEllipsisCenter/>}
    </Modal>
  )
}
