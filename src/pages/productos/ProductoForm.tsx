import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Bounce, toast } from "react-toastify";
import { LdsBar, LdsEllipsisCenter } from "../../core/components/Loaders";
import useLayoutStore from "../../core/store/useLayoutStore";
import { useMutationProductosQuery } from "../../core/hooks/useProductosQuery";
import useCatalogosStore from "../../core/store/useCatalogosStore";
import { useProductos } from "./context/ProductosContext";
import { ResponseQuery, Producto } from "../../core/types";
import CategoriasOpc from "./CategoriasOpc";
import { CategoriaOpc } from "../../core/types/catalogosTypes";

interface DataGetProducto extends ResponseQuery {
  content: Producto | null;
}

type GetProductoQuery = {
  data: DataGetProducto | null ;
  isPending: boolean;
  isError: boolean;
  getProducto: (id: number) => void
  reset: (producto: any) => void
}

const productoFormInit = {
  id: 0,
  codigo: '',
  barcode: '',
  categoria_ids: [],
  descripcion: '',
  unidad_medida_cod: 'NIU',
  tipo_moneda_cod: 'PEN',
  precio_venta: 0,
  precio_costo: 0,
  impuesto_id_igv: 1,
  impuesto_id_icbper: 0,
  inventareable: 0,
  lotizable: 0,
  stock: 0,
  stock_min: 0,
  imagen: '',
  estado: 1,
  created_at: '',
  updated_at: '',
}

const calcInit = {
  valorVenta: 0,
}
export default function Productoform(){
  const [calc, setCalc] = useState(calcInit)
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const catalogos = useCatalogosStore(state => state.catalogos)

  const {
    modo, 
    setModo, 
    categoriasOpc, 
    setCategoriasOpc,
    resetCategoriasOpc,
  } = useProductos()

  const {
    register, 
    formState: {errors, isDirty},
    setValue,
    handleSubmit, 
    reset,
    watch,
  } = useForm<Producto>({defaultValues: productoFormInit})
  
  const {
    data: producto,
    isPending: isPendingProducto,
    isError: isErrorProducto,
    getProducto,
  }: GetProductoQuery = useMutationProductosQuery()

  const {
    data: mutation,
    isPending: isPendingMutation,
    createProducto, 
    updateProducto, 
  } = useMutationProductosQuery()
  
  const submit = (data: Producto) => {
    console.log(data)
    return
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
    if(modo.vista === "edit"){
      if(modo.productoId) {
        getProducto(modo.productoId)
      }
    }else{
      reset(productoFormInit)
      if(categoriasOpc?.findIndex(el=>el.checked) != -1){
        resetCategoriasOpc()
      }
    }
  },[modo.vista])

  useEffect(()=>{
    if(!producto) return
    const arrCategoriaIds = producto.content?.categoria_ids
      // ? producto.content?.categoria_ids.split(",").map(el=>parseInt(el))
      // : []
    const newCategoriasOpc = categoriasOpc?.map(el=>{
      return {...el, checked: arrCategoriaIds?.includes(el.id)}
    }) as CategoriaOpc[]
    setCategoriasOpc(newCategoriasOpc)
  },[producto])

  useEffect(() => {
    if(!producto) return
    if(producto.error){
      toast.error("Error al obtener los datos", {
        autoClose: 3000, transition: Bounce,
      })
    }else{
      if(producto.content) {
        reset(producto.content)
      }
    }
  }, [producto])
  
  useEffect(() => {
    // console.log(categoriasOpc?.filter(el=>el.checked))
  }, [categoriasOpc])

  useEffect(()=>{
    const igv = catalogos?.impuestos.find(el=>el.id === watch('impuesto_id_igv'))?.porcentaje
    if(!igv) return setCalc({...calc, valorVenta: 0})
    const valorVenta = watch('precio_venta')/(1 + igv/100)
    setCalc({...calc, valorVenta: parseFloat(valorVenta.toFixed(2))})
  },[watch('precio_venta')])



  useEffect(() => {
    if(!isErrorProducto) return
    toast.error("Error de conexion", {
      autoClose: 3000,
      transition: Bounce,
    })
  }, [isErrorProducto])

  useEffect(() => {
    if(!mutation) return
    if(!mutation.error) setModo((prev)=>({...prev, vista:"list"}));
    toast(mutation.msg, {
      type: mutation.msgType,
      autoClose: 3000,
      transition: Bounce,
    })
  }, [mutation])

  return (
    <Container className={`${modo.vista === "list" ? "d-none" : ""}`}>
      <CategoriasOpc setValue={setValue}/>
      <Form onSubmit={handleSubmit(submit)} id="form_productos">
        {isPendingMutation && <LdsBar />}
        <div className="d-flex gap-2 justify-content-end">
          <Button
            variant="seccondary"
            type="button"
            onClick={()=>setModo((prev)=>({...prev, vista:"list"}))}
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
        <Row>
          <Form.Group as={Col} md={12} xl={9} className="mb-3">
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
          <Form.Group as={Col} md={4} xl={4} className="mb-3">
            <Form.Label htmlFor="codigo">Código</Form.Label>
            <Form.Control
              id="codigo"
              {...register('codigo', {
                maxLength: {value: 10, message:"Se permite máximo 10 caracteres"}
              })}
            />
            {errors.codigo && 
              <div className="invalid-feedback d-block">{errors.codigo.message}</div>
            }
          </Form.Group>
          <Form.Group as={Col} md={4} xl={4} className="mb-3">
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
          <Form.Group as={Col} md={4} xl={4} className="mb-3">
            <Form.Label htmlFor="categoria_ids">Categoria</Form.Label>
            <Form.Control
              id="categoria_ids"
              {...register('categoria_ids', {
                maxLength: {value: 20, message:"Se permite máximo 2o caracteres"}
              })}
            />
            {errors.categoria_ids && 
              <div className="invalid-feedback d-block">{errors.categoria_ids.message}</div>
            }
          </Form.Group>
          <Form.Group as={Col} md={4} xl={3} className="mb-3">
            <Form.Label htmlFor="unidad_medida_cod">Unidad</Form.Label>
            <Form.Select
              id="unidad_medida_cod"
              {...register('unidad_medida_cod')}
            >
              {catalogos?.unidades_medida.map((el) => 
                <option key={el.codigo} value={el.codigo}>{el.descripcion}</option>
              )}
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md={4} xl={3} className="mb-3">
            <Form.Label htmlFor="tipo_moneda_cod">Moneda</Form.Label>
            <Form.Select
              id="tipo_moneda_cod"
              {...register('tipo_moneda_cod')}
            >
              {catalogos?.tipos_moneda.map((el) => 
                <option key={el.codigo} value={el.codigo}>{el.descripcion}</option>
              )}
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md={4} xl={4} className="mb-3">
            <Form.Label htmlFor="precio_venta">precio de venta</Form.Label>
            <Form.Control
              id="precio_venta"
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
          <Form.Group as={Col} md={4} xl={3} className="mb-3">
            <Form.Label htmlFor="impuesto_id_igv">Afectación IGV</Form.Label>
            <Form.Select
              id="impuesto_id_igv"
              {...register('impuesto_id_igv', {valueAsNumber:true})}
            >
              {catalogos?.impuestos.filter(el=>el.afectacion_igv_desc != "ICBPER").map((el) => 
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
              {catalogos?.impuestos.filter(el=>el.afectacion_igv_desc === "ICBPER").map((el) => 
                <option key={el.id} value={el.id}>
                  {`${el.afectacion_igv_desc} (${el.importe})`}
                </option>
              )}
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md={4} xl={4} className="mb-3">
            <Form.Label htmlFor="stock">Stock</Form.Label>
            <Form.Control
              id="stock"
              type="number"
              step={0.01}
              {...register('stock', {valueAsNumber:true})}
            />
            {errors.stock && 
              <div className="invalid-feedback d-block">{errors.stock.message}</div>
            }
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
        {isPendingProducto && <LdsEllipsisCenter/>}
      </Form>
    </Container>
  )
}