import { Button, Form, InputGroup } from "react-bootstrap"
import { useMutationProductosQuery } from "../../../core/hooks/useProductosQuery"
import { useEffect, useRef } from "react"
import { toast } from "react-toastify"
import { useMovimientos } from "../hooks/useMovimientos"
import { type MovimientoFormDetalle } from "../../../core/types"
import useSessionStore from "../../../core/store/useSessionStore"

export default function BusquedaProducto() {
  const thisTerm = useSessionStore(state=>state.thisTerm)
  const formRef = useRef<HTMLFormElement | null>(null)
  const {
    agregarProducto,
    userMovimientoForm: {
      getValues
    }
  } = useMovimientos()

  const {
    data: producto,
    getProductoByCode
  } = useMutationProductosQuery()

  const handleSubmit = ((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let {value} = e.currentTarget.buscar
    if(!value) return
    if(thisTerm){
      getProductoByCode(value.toUpperCase(), thisTerm.establecimiento_id)
    }
  })

  useEffect(() => {
    if(!producto) return
    if(producto.error){
      toast.warning("No se encontró el producto")
    }else{
      if(producto.content) {
        if(getValues().tipo === "salida" && !producto.content.stock){
          toast.warning("no hay stock de: " + producto.content.descripcion)
        }else{
          const nuevoProducto: MovimientoFormDetalle = {
            tmp_id: 0,
            movimiento_id: 0,
            producto_id: producto.content.id,
            codigo: producto.content.codigo,
            producto_descripcion: producto.content.descripcion,
            marca: producto.content.marca,
            laboratorio: producto.content.laboratorio,
            precio_costo: parseFloat(producto.content.precio_costo),
            stock: parseFloat(producto.content.stock),
            cantidad: 1,
            observacion: ""
          }
          agregarProducto(nuevoProducto)
          if(formRef.current) formRef.current.buscar.value = ""
        }
      }
    }
  }, [producto])

  return (
    <Form 
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <InputGroup className="mb-3">
        <Form.Control
          name="buscar"
          type="search"
          placeholder="Ingrese el código del producto"
          aria-label="Recipient's username with two button addons"
        />
        <Button variant="outline-secondary" type="submit">Agregar</Button>
        <Button variant="outline-secondary" type="button">Buscar</Button>
      </InputGroup>
    </Form>
  )
}
