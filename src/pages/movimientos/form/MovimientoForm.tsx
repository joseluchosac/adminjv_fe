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

export default function Movimientoform(){
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const establecimientos = useCatalogosStore(state => state.catalogos?.establecimientos)
  const tipos_movimiento = useCatalogosStore(state => state.catalogos?.tipos_movimiento)

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
    console.log(data)
    createMovimiento(data)
    return
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
        // createMovimiento(data)
      }
    });
  };

  useEffect(()=>{
    if(modo.vista === "edit"){
      // setValue("establecimiento_id", establecimiento_id)
    }else{
      // reset(movimientoFormInit)
    }
  },[modo.vista])

  useEffect(()=>{
    setValue("concepto","")
  },[watch().tipo])
  // useEffect(() => {
  //   if(!movimiento) return
  //   if(movimiento.error){
  //     toast.error("Error al obtener los datos")
  //   }else{
  //     if(movimiento.content) {
  //       reset(movimiento.content)
  //     }
  //   }
  // }, [movimiento])
  
  // useEffect(() => {
  //   if(!isErrorMovimiento) return
  //   toast.error("Error de conexion")
  // }, [isErrorMovimiento])

  useEffect(() => {
    if(!mutation) return
    if(!mutation.error) setModo((prev)=>({...prev, vista:"list"}));
    toast(mutation.msg, {type: mutation.msgType})
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
                    <Form.Label htmlFor="establecimiento_id">Sucursal</Form.Label>
                    <Form.Select
                      id="establecimiento_id"
                      {...register('establecimiento_id', {
                        required: "Elija un establecimiento",
                        min:{value: 1, message:"Elija una sucursal"},
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
