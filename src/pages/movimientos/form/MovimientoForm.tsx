import { useEffect } from "react";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { LdsBar } from "../../../core/components/Loaders";
import useLayoutStore from "../../../core/store/useLayoutStore";
import { useMutationMovimientosQuery } from "../../../core/hooks/useMovimientosQuery";
import useCatalogosStore from "../../../core/store/useCatalogosStore";
import { type Movimientoform } from "../../../core/types";
import { useMovimientos } from "../hooks/useMovimientos";
import MovimientoFormDetalle from "./MovimientoFormDetalle";
import BusquedaProducto from "./BusquedaProducto";
import useSessionStore from "../../../core/store/useSessionStore";
import { movimientoFormInit } from "../context/MovimientosContext";
import { cropText } from "../../../core/utils/funciones";

export default function Movimientoform(){
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const establecimientos = useCatalogosStore(state => state.catalogos?.establecimientos)
  const tipos_movimiento = useCatalogosStore(state => state.catalogos?.tipos_movimiento)
  const curEstab = useSessionStore(state => state.curEstab)
  const { 
    modo,
    setModo,
    userMovimientoForm:{
      register,
      formState: {errors, isDirty},
      setValue,
      getValues,
      handleSubmit, 
      reset,
      watch,
    }
  } = useMovimientos()

  const {
    data: mutation,
    isPending: isPendingMutation,
    createMovimiento, 
  } = useMutationMovimientosQuery()
  // devuelve un arreglo de tipos de movimiento
  const tiposOpc = ():string[] => {
    const tipos = tipos_movimiento?.filter(el => el.origen==="interno").map(el=>el.tipo)
    return tipos ? [...new Set(tipos)] : []
  }
  const conceptosOpc = ():string[] => {
    const concep = tipos_movimiento?.filter(el => el.origen==="interno" && el.tipo === getValues().tipo)
    .map(el=>el.concepto)
    return concep ? concep : []
  }

  const submit = (data: Movimientoform) => {
    if(data.establecimiento_id == data.destino_id){
      toast.warning("Elija otro destino")
      return
    }
    if(!data.detalle.length){
      toast.warning("Ingrese los productos")
      return
    }
    for(const el of data.detalle){
      if(el.cantidad < 0.10){
        toast.warning(`Ingrese una cantidad válida del producto ${cropText(el.producto_descripcion,30)}`)
        return
      }
      if(el.precio_costo.toString() == "" || el.precio_costo < 0){
        toast.warning(`Ingrese un precio válido del producto ${cropText(el.producto_descripcion,30)}`)
        return
      }
    }

    Swal.fire({
      icon: 'question',
      text: `¿Desea generar el movimiento?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('form_movimientos'),
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        createMovimiento(data)
      }
    });
  };

  useEffect(()=>{
    if(modo.vista === "edit" && curEstab){
      setValue("establecimiento_id", curEstab)
    }else{
      reset(movimientoFormInit)
    }
  },[modo.vista])

  useEffect(()=>{
    setValue("concepto","")
  },[watch().tipo])

  useEffect(()=>{
    setValue("detalle", [])
  },[watch().tipo, watch().establecimiento_id])

  useEffect(()=>{
    setValue("destino_id", 0)
  },[watch().concepto])

  useEffect(() => {
    if(!mutation) return
    toast(mutation.msg, {type: mutation.msgType})
    if(!mutation.error){
      setModo((prev)=>({...prev, vista:"list"}));
    }
  }, [mutation])

  return (
    <Container className={`${modo.vista === "list" ? "d-none" : ""}`}>
      <Form onSubmit={handleSubmit(submit)} id="form_movimientos">
        <div className="my-2 d-md-flex justify-content-between">
          <div className="text-center"><h5>Nuevo Movimiento</h5></div>
          <div className="d-md-flex text-center">
            <Button
              variant="seccondary"
              type="button"
              onClick={()=>setModo((prev)=>({...prev, vista:"list"}))}
            >
              Cerrar
            </Button>
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
            <button type="button" onClick={()=> reset()}>reset</button>
          </div>
        </div>
        {isPendingMutation && <LdsBar />}
        <Row>
          <Col>
            <Card className="mb-4">
              <Card.Header></Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Form.Group as={Col} xl={12} className="mb-3">
                    <Form.Label htmlFor="establecimiento_id">Establecimiento</Form.Label>
                    <Form.Select
                      id="establecimiento_id"
                      {...register('establecimiento_id', {
                        min:{value: 1, message:"Elija un establecimiento valido"},
                        valueAsNumber: true
                      })}
                    >
                      <option value="0"></option>
                      {establecimientos?.map(el => 
                        <option key={el.id} value={el.id}>{el.descripcion}</option>
                      )}
                    </Form.Select>
                    {errors.establecimiento_id && 
                      <div className="invalid-feedback d-block">{errors.establecimiento_id.message}</div>
                    }
                  </Form.Group> 
                  <Form.Group as={Col} xl={12} className="mb-3">
                    <Form.Label htmlFor="tipo">Tipo</Form.Label>
                    <Form.Select
                      id="tipo"
                      {...register('tipo', {
                        required: "Elija un tipo de movimiento",
                      })}
                    >
                      <option value=""></option>
                      {tiposOpc().map((el, idx) => 
                        <option key={idx} value={el}>{el.toUpperCase()}</option>
                      )}
                    </Form.Select>
                    {errors.tipo && 
                      <div className="invalid-feedback d-block">{errors.tipo.message}</div>
                    }
                  </Form.Group>
                  <Form.Group as={Col} xl={12} className="mb-3">
                    <Form.Label htmlFor="concepto">Concepto</Form.Label>
                    <Form.Select
                      id="concepto"
                      {...register('concepto', {
                        required: "Elija un concepto de movimiento",
                      })}
                    >
                      <option value=""></option>
                      {conceptosOpc().map((el, idx) => 
                        <option key={idx} value={el}>{el.toUpperCase()}</option>
                      )}
                    </Form.Select>
                    {errors.concepto && 
                      <div className="invalid-feedback d-block">{errors.concepto.message}</div>
                    }
                  </Form.Group>
                  <Form.Group as={Col} xl={12} className="mb-3">
                    <Form.Label htmlFor="destino_id">Destino traspaso</Form.Label>
                    <Form.Select
                      id="destino_id"
                      disabled={watch("concepto").toLowerCase() === "traspaso" ? false : true}
                      {...register('destino_id', {
                        validate: (val: number) => {
                          if (watch('concepto').toLowerCase() == "traspaso" && !val) {
                            return "Elija el destino cuando el concepto es traspaso";
                          }
                        },
                        valueAsNumber: true
                      })}
                    >
                      <option value="0"></option>
                      {establecimientos?.map(el => 
                        <option key={el.id} value={el.id}>{el.descripcion}</option>
                      )}
                    </Form.Select>
                    {errors.destino_id && 
                      <div className="invalid-feedback d-block">{errors.destino_id.message}</div>
                    }
                  </Form.Group> 
                  <Form.Group as={Col} lg={12} className="mb-3">
                    <Form.Label htmlFor="observacion">Observación</Form.Label>
                    <Form.Control
                      id="observacion"
                      {...register('observacion')}
                    />
                  </Form.Group>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
        <Row>
          <Col>
            <BusquedaProducto />
          </Col>
        </Row>
        <Row>
          <Col>
            <MovimientoFormDetalle />
          </Col>
        </Row>
        {/* {isPendingMovimiento && <LdsEllipsisCenter/>} */}
    </Container>
  )
}
