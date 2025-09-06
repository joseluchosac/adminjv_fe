import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Modal, Row, Spinner, Tab, Tabs } from "react-bootstrap";
import { useForm, UseFormSetValue } from "react-hook-form";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { LdsBar, LdsEllipsisCenter } from "../../../app/components/Loaders";
import useLayoutStore from "../../../app/store/useLayoutStore";
import { MutationProductoRes, useMutationProductosQuery } from "../../../api/queries/useProductosQuery";
// import { useProductos } from "../context/ProductosContext";
import { Producto, ProductoQryRes } from "../../../app/types";
import CategoriasOpc from "./CategoriasOpc";
import { LaboratorioSelect, MarcasSelect } from "./Selects";
import { useMutationMarcasQuery } from "../../../api/queries/useMarcasQuery";
import { MutationLaboratorioRes, useMutationLaboratoriosQuery } from "../../../api/queries/useLaboratoriosQuery";
import { useImpuestosQuery, useTiposMonedaQuery, useUnidadesMedidaQuery } from "../../../api/queries/useCatalogosQuery";
import useProductosStore from "../../../app/store/useProductosStore";

const productoFormInit = {
  id: 0,
  codigo: '',
  barcode: '',
  categoria_ids: [],
  descripcion: '',
  marca_id: 0,
  marca: "",
  laboratorio_id: 0,
  laboratorio: "",
  unidad_medida_cod: 'NIU',
  tipo_moneda_cod: 'PEN',
  precio_venta: 0,
  precio_costo: 0,
  impuesto_id_igv: 1,
  impuesto_id_icbper: 0,
  inventariable: 0,
  lotizable: 0,
  stock: 0,
  stock_min: 0,
  thumb: '',
  estado: 1,
  created_at: '',
  updated_at: '',
}

const calcInit = {
  valorVenta: 0,
}

export default function Productoform(){
  const showProductoForm = useProductosStore(state => state.showProductoForm) // bool
  const setShowProductoForm = useProductosStore(state => state.setShowProductoForm)
  const currentProductoId = useProductosStore(state => state.currentProductoId) // number
  const setCurrentProductoId = useProductosStore(state => state.setCurrentProductoId)
  const [showMarcaForm, setShowMarcaForm] = useState(false)  
  const [showLaboratorioForm, setShowLaboratorioForm] = useState(false)  
  const [calc, setCalc] = useState(calcInit)
  const [tab, setTab] = useState<string>("precios")
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const {tiposMoneda} = useTiposMonedaQuery()
  // const { modo, setModo } = useProductos()
  const {unidadesMedida} = useUnidadesMedidaQuery()
  const {impuestos} = useImpuestosQuery()
  const {
    register,
    control,
    formState: {errors, isDirty},
    setValue,
    getValues,
    handleSubmit, 
    reset,
    watch,
    clearErrors,
  } = useForm<Producto>({defaultValues: productoFormInit})
  
  const {
    data: producto,
    isPending: isPendingProducto,
    isError: isErrorProducto,
    getProducto,
  } = useMutationProductosQuery<ProductoQryRes>()

  const {
    data: mutation,
    isPending: isPendingMutation,
    createProducto, 
    updateProducto, 
  } = useMutationProductosQuery<ProductoQryRes>()
  
  const submit = (data: Producto) => {
    // console.log(data)
    // return
    Swal.fire({
      icon: 'question',
      text: data.id
        ? `¿Desea guardar los cambios de ${data.descripcion}?`
        : `¿Desea registrar a ${data.descripcion}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      target: document.getElementById('form_productos'),
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (data.id){
          updateProducto(data)
        }else{
          createProducto(data)
        }
      }
    });
  };

  useEffect(()=>{
    if(showProductoForm){
      if(currentProductoId){
        getProducto(currentProductoId)
      }else{
        reset(productoFormInit)
      }
    }else{
      setCurrentProductoId(0)
      reset(productoFormInit)
    }
  },[showProductoForm])


  useEffect(() => {
    if(!producto) return
    if(producto.error){
      toast.error("Error al obtener los datos")
    }else{
      if(producto.content) {
        reset(producto.content)
      }
    }
  }, [producto])
  
  useEffect(()=>{
    if(!impuestos.length) return
    let igv = impuestos?.find(el=>el.id === watch('impuesto_id_igv'))?.porcentaje
    igv = igv ? igv : 0
    const valorVenta = watch('precio_venta')/(1 + igv/100)
    setCalc({...calc, valorVenta: parseFloat(valorVenta.toFixed(2))})
  },[watch('precio_venta'), watch('impuesto_id_igv')])

  useEffect(() => {
    if(!isErrorProducto) return
    toast.error("Error de conexion")
  }, [isErrorProducto])

  useEffect(() => {
    if(!mutation) return
    if(!mutation.error) setShowLaboratorioForm(false);
    toast(mutation.msg, {type: mutation.msgType})
  }, [mutation])

  if(showProductoForm)
  return (
    <Container>
      <Form onSubmit={handleSubmit(submit)} id="form_productos">
        <div className="my-2 d-md-flex justify-content-between">
          <div className="text-center"><h5>{currentProductoId ? "Editar producto" : "Nuevo prducto"}</h5></div>
          <div className="d-md-flex text-center">
            <Button
              variant="seccondary"
              type="button"
              onClick={()=>setShowProductoForm(false)}
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
          </div>
        </div>
        {isPendingMutation && <LdsBar />}
        <Row>
          <Col md={8} lg={9}>
            <Card className="mb-4">
              <Card.Header></Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Form.Group as={Col} xl={12} className="mb-3">
                    <Form.Label htmlFor="descripcion">Descripción</Form.Label>
                    <Form.Control
                      id="descripcion"
                      {...register('descripcion', {
                        required: "Ingrese la descripción",
                        minLength: {value: 3, message:"Se permite mínimo 3 caracteres"},
                      })}
                    />
                    {errors.descripcion && 
                      <div className="invalid-feedback d-block">{errors.descripcion.message}</div>
                    }
                  </Form.Group> 
                  <Form.Group as={Col} lg={3} className="mb-3">
                    <Form.Label htmlFor="codigo">Código</Form.Label>
                    <Form.Control
                      id="codigo"
                      {...register('codigo', {
                        maxLength: {value: 11, message:"Se permite máximo 11 caracteres"}
                      })}
                    />
                    {errors.codigo && 
                      <div className="invalid-feedback d-block">{errors.codigo.message}</div>
                    }
                  </Form.Group>
                  <Form.Group as={Col} lg={4} className="mb-3">
                    <Form.Label htmlFor="barcode">Código de barras</Form.Label>
                    <Form.Control
                      id="barcode"
                      {...register('barcode', {
                        maxLength: {value: 20, message:"Se permite máximo 2o caracteres"}
                      })}
                    />
                    {errors.barcode && 
                      <div className="invalid-feedback d-block">{errors.barcode.message}</div>
                    }
                  </Form.Group>
                  <Form.Group as={Col} lg={4} className="mb-3">
                    <Form.Label htmlFor="unidad_medida_cod">Unidad</Form.Label>
                    <Form.Select
                      id="unidad_medida_cod"
                      {...register('unidad_medida_cod')}
                    >
                      {unidadesMedida?.map((el) => 
                        <option key={el.codigo} value={el.codigo}>{el.descripcion}</option>
                      )}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group as={Col} lg={6} className="mb-3">
                    <MarcasSelect
                      control={control} 
                      getValues={getValues} 
                      setValue={setValue} 
                      clearErrors={clearErrors}
                      setShowMarcaForm={setShowMarcaForm}
                    />
                  </Form.Group>
                  <Form.Group as={Col} lg={6} className="mb-3">
                    <LaboratorioSelect 
                      control={control} 
                      getValues={getValues} 
                      setValue={setValue} 
                      clearErrors={clearErrors}
                      setShowLaboratorioForm={setShowLaboratorioForm}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Col>
                    <Tabs
                      id="controlled-tab-example"
                      activeKey={tab}
                      onSelect={(k) => setTab(k as string)}
                      className="mb-3"
                    >
                      <Tab eventKey="precios" title="Precios">
                        <Row>
                          <Form.Group as={Col} sm={4} className="mb-3">
                            <Form.Label htmlFor="tipo_moneda_cod">Moneda</Form.Label>
                            <Form.Select
                              id="tipo_moneda_cod"
                              {...register('tipo_moneda_cod')}
                            >
                              {tiposMoneda.map((el) => 
                                <option key={el.codigo} value={el.codigo}>{el.descripcion}</option>
                              )}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} sm={4} className="mb-3">
                            <Form.Label htmlFor="impuesto_id_igv">Afectación IGV</Form.Label>
                            <Form.Select
                              id="impuesto_id_igv"
                              {...register('impuesto_id_igv', {valueAsNumber:true})}
                            >
                              {impuestos.filter(el=>el.afectacion_igv_desc != "ICBPER").map((el) => 
                                <option key={el.id} value={el.id}>{`${el.afectacion_igv_desc} (${el.porcentaje}%)`}</option>
                              )}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md={4} xl={3} className="mb-3">
                            <Form.Label htmlFor="impuesto_id_icbper">ICBPER</Form.Label>
                            <Form.Select
                              id="impuesto_id_icbper"
                              {...register('impuesto_id_icbper', {valueAsNumber:true})}
                            >
                                <option value={0}></option>
                              {impuestos.filter(el=>el.afectacion_igv_desc === "ICBPER").map((el) => 
                                <option key={el.id} value={el.id}>
                                  {`${el.afectacion_igv_desc} (${el.importe})`}
                                </option>
                              )}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} md={4} xl={4} className="mb-3">
                            <Form.Label htmlFor="precio_venta">precio de venta</Form.Label>
                            <Form.Control
                              id="precio_venta"
                              type="number"
                              {...register('precio_venta', {
                                required: "Este campo es obligatorio",
                                pattern: {
                                  value: /^[0-9]+(\.[0-9]{1,2})?$/,
                                  message: "Solo se permiten números con hasta 2 decimales",
                                },
                              })}
                            />
                            {errors.precio_venta && 
                              <div className="invalid-feedback d-block">{errors.precio_venta.message}</div>
                            }
                          </Form.Group>
                          <Form.Group as={Col} md={4} xl={4} className="mb-3">
                            <Form.Label htmlFor="valor_venta">Valor venta</Form.Label>
                            <Form.Control
                              id="valor_venta"
                              disabled
                              readOnly
                              value={calc.valorVenta}
                            />
                          </Form.Group>
                          <Form.Group as={Col} md={4} xl={4} className="mb-3">
                            <Form.Label htmlFor="precio_costo">Precio de costo</Form.Label>
                            <Form.Control
                              id="precio_costo"
                              type="number"
                              step={0.01}
                              {...register('precio_costo', {valueAsNumber:true})}
                            />
                            {errors.precio_costo && 
                              <div className="invalid-feedback d-block">{errors.precio_costo.message}</div>
                            }
                          </Form.Group>
                        </Row>
                      </Tab>
                      <Tab eventKey="inventario" title="Inventario">
                        <Row>
                          <Form.Group as={Col} className="mb-3" controlId="inventariable">
                            <Form.Check {...register('inventariable')} label="Inventariable" />
                          </Form.Group>
                          <Form.Group as={Col} className="mb-3" controlId="lotizable">
                            <Form.Check {...register('lotizable')} label="Lotizable" />
                          </Form.Group>
                        </Row>
                        <Row>
                          <Form.Group as={Col} md={4} xl={4} className="mb-3">
                            <Form.Label htmlFor="stock">Stock</Form.Label>
                            <Form.Control
                              id="stock"
                              type="number"
                              step={0.01}
                              disabled
                              {...register('stock', {valueAsNumber:true})}
                            />
                          </Form.Group>
                          <Form.Group as={Col} md={4} xl={4} className="mb-3">
                            <Form.Label htmlFor="stock_min">Stock mínimo</Form.Label>
                            <Form.Control
                              id="stock_min"
                              type="number"
                              step={0.01}
                              {...register('stock_min', {valueAsNumber:true})}
                            />
                            {errors.stock_min && 
                              <div className="invalid-feedback d-block">{errors.stock_min.message}</div>
                            }
                          </Form.Group>
                        </Row>
                      </Tab>
                    </Tabs>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <CategoriasOpc
              setValue={setValue}
              getValues={getValues}
              producto={producto}
            />
          </Col>
        </Row>
        {isPendingProducto && <LdsEllipsisCenter/>}
      </Form>
      <MarcaForm
        showMarcaForm={showMarcaForm}
        setShowMarcaForm={setShowMarcaForm}
        setValue={setValue}
      />
      <LaboratorioForm
        showLaboratorioForm={showLaboratorioForm}
        setShowLaboratorioForm={setShowLaboratorioForm}
        setValue={setValue}
      />
    </Container>
  )
}


// ✅ MODAL FORMULARIO MARCA

type MarcaFormProps = {
  showMarcaForm: boolean;
  setShowMarcaForm: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: UseFormSetValue<Producto>;
}
const marcaFormInit = {id: 0, nombre: "", estado: 1}

function MarcaForm({showMarcaForm, setShowMarcaForm, setValue}: MarcaFormProps){
  const [marcaForm, setMarcaForm] = useState(marcaFormInit)
  const {
    data: mutation,
    isPending: isPendingMutation,
    isError: isErrorMutation,
    createMarca, 
  } = useMutationMarcasQuery<MutationProductoRes>()

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createMarca(marcaForm)
  };

  useEffect(() => {
    if(!showMarcaForm){
      setMarcaForm(marcaFormInit)
    }
  }, [showMarcaForm])

  
  useEffect(() => {
    if(!mutation) return
    if(!mutation.error){
      setShowMarcaForm(false);
      setValue("marca_id", mutation.content.id || 0, {shouldDirty: true})
      setValue("marca", mutation.content.nombre || "")
    }
    toast(mutation.msg, {type: mutation.msgType })
  }, [mutation])

  useEffect(() => {
    if(!isErrorMutation) return
    toast.error("Error al procesar solicitud")
  }, [isErrorMutation])

  return (
    <Modal show={showMarcaForm} onHide={()=>setShowMarcaForm(false)} size="md" >
      <Modal.Header closeButton className="py-2">
        <Modal.Title>Crear marca</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {isPendingMutation && <LdsBar />}
          <Row>
            <Form.Group as={Col} md={12} className="mb-3">
              <Form.Label htmlFor="nombre">Marca</Form.Label>
              <Form.Control
                id="nombre"
                autoFocus
                value={marcaForm.nombre}
                onChange={e=>{
                  setMarcaForm({...marcaForm, nombre: e.target.value})
                }}
              />
            </Form.Group>
          </Row>
          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="seccondary"
              type="button"
              onClick={()=>setShowMarcaForm(false)}
            >Cerrar</Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}


// ✅ MODAL FORMULARIO LABORATORIO

type LaboratorioFormProps = {
  showLaboratorioForm: boolean;
  setShowLaboratorioForm: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: UseFormSetValue<Producto>;
}
const laboratorioFormInit = {id: 0, nombre: "", estado: 1}

function LaboratorioForm({showLaboratorioForm, setShowLaboratorioForm, setValue}: LaboratorioFormProps){
  const [laboratorioForm, setLaboratorioForm] = useState(laboratorioFormInit)
  const {
    data: mutation,
    isPending: isPendingMutation,
    isError: isErrorMutation,
    createLaboratorio, 
  } = useMutationLaboratoriosQuery<MutationLaboratorioRes>()

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createLaboratorio(laboratorioForm)
  };

  useEffect(() => {
    if(!showLaboratorioForm){
      setLaboratorioForm(laboratorioFormInit)
    }
  }, [showLaboratorioForm])

  
  useEffect(() => {
    if(!mutation) return
    if(!mutation.error){
      setShowLaboratorioForm(false);
      setValue("laboratorio_id", mutation.content.id || 0, {shouldDirty: true})
      setValue("laboratorio", mutation.content.nombre || "")
    }
    toast(mutation.msg, {type: mutation.msgType})
  }, [mutation])

  useEffect(() => {
    if(!isErrorMutation) return
    toast.error("Error al procesar solicitud")
  }, [isErrorMutation])

  return (
    <Modal show={showLaboratorioForm} onHide={()=>setShowLaboratorioForm(false)} size="md" >
      <Modal.Header closeButton className="py-2">
        <Modal.Title>Crear laboratorio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {isPendingMutation && <LdsBar />}
          <Row>
            <Form.Group as={Col} md={12} className="mb-3">
              <Form.Label htmlFor="nombre">Laboratorio</Form.Label>
              <Form.Control
                id="nombre"
                autoFocus
                value={laboratorioForm.nombre}
                onChange={e=>{
                  setLaboratorioForm({...laboratorioForm, nombre: e.target.value})
                }}
              />
            </Form.Group>
          </Row>
          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="seccondary"
              type="button"
              onClick={()=>setShowLaboratorioForm(false)}
            >Cerrar</Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}