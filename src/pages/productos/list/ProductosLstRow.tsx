import { format, isValid, parseISO } from "date-fns";
import { CampoTable, Producto, ProductoItem, QueryResp } from "../../../core/types";
import { useProductos } from "../context/ProductosContext";
import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import useLayoutStore from "../../../core/store/useLayoutStore";
import { useMutationProductosQuery } from "../../../core/hooks/useProductosQuery";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useSessionStore from "../../../core/store/useSessionStore";

interface ProductosLstRowProps {
  producto: ProductoItem ;
  camposProducto: CampoTable[]
}

interface ProductoMutQryRes extends QueryResp {
  content: Producto | null
}
function ProductosLstRow({ producto, camposProducto }: ProductosLstRowProps) {
  const {setModo} = useProductos()
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const curEstab = useSessionStore(state => state.curEstab)

  const {
    data: mutation,
    isPending: isPendingMutation,
    updateEstado,
    deleteProducto, 
  } = useMutationProductosQuery<ProductoMutQryRes>()

  const validDate = (date:string | undefined, formato = "dd/MM/yyyy") => {
    if(!date) return ''
    return isValid(parseISO(date)) ? format(date, formato) : ''
  }

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setModo(prev=>({...prev, vista:"edit", productoId:producto.id}))
  }

  const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar el producto ${producto.descripcion}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProducto(producto.id)
      }
    });
  }

  const toggleEstado = () => {
    updateEstado({id: producto.id, estado: producto.estado ? 0 : 1})
  }


  useEffect(() => {
    if(!mutation) return
    toast(mutation.msg, { type: mutation.msgType})
  }, [mutation])

  return (
    <tr className="text-nowrap">
      {camposProducto.filter(el=>el.show).map(el => {
        switch (el.field_name){
          case "acciones": {
           if(isPendingMutation) return <td key={el.field_name}>...</td>  
            return (
              <td key={el.field_name}>
                <div className="d-flex gap-2 justify-content-start">
                  <a onClick={handleToEdit} href="#" className="" title="Editar">
                    <FaEdit />
                  </a>
                  <a onClick={handleDelete} href="#" className="" title="Eliminar">
                    <FaTrash className="text-danger"/>
                  </a>
                  {producto.estado == 0
                    ? <div role="button" className="" onClick={toggleEstado} title="Habilitar" data-estado="0">
                        <FaToggleOff className="text-muted" size={"1.3rem"} />
                      </div>
                    : <div role="button" className="" onClick={toggleEstado} title="Deshabilitar" data-estado="1">
                        <FaToggleOn className="text-primary" size={"1.3rem"} />
                      </div>
                  }
                </div>
              </td>
            )
          }
          case "descripcion":{
            return (
              <td 
                key={el.field_name}
                className="overflow-hidden text-wrap"
                style={{minWidth: "300px", maxWidth:"450px"}}
                title={producto[el.field_name] as string}
              >
                <div>{producto[el.field_name]}</div>
                <div className="d-flex gap-3 text-muted">
                  {producto.marca ? <div><small>{producto.marca}</small></div> :''}
                  {producto.laboratorio ? <div><small>{producto.laboratorio}</small></div> :''}
                  {producto.codigo ? <div><small>{producto.codigo}</small></div> :''}
                  {producto.barcode ? <div><small>Bar: {producto.barcode}</small></div> :''}
                </div>
              </td>
            )
          }
          case "stocks": {
            const stock = producto.stocks.find(el=>parseFloat(el.e) === curEstab)
            return <td key={el.field_name}>{stock?.s} {producto.unidad_medida_cod}</td>
          }
          default: {
            return <td key={el.field_name}>{producto[el.field_name as keyof Omit<ProductoItem, 'stocks'> ]}</td>
          }
        }
      })}
    </tr>
  );
}

export default ProductosLstRow;
