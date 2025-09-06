import { ProductoItem, ApiResp} from "../../../app/types";
import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { useMutationProductosQuery } from "../../../api/queries/useProductosQuery";
import Swal from "sweetalert2";
import useLayoutStore from "../../../app/store/useLayoutStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useProductosStore from "../../../app/store/useProductosStore";

interface Props {
  producto: ProductoItem ;
}
type MutationRes = ApiResp & {
  producto?: ProductoItem
};
function ProductosListItem({ producto }: Props) {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const camposProducto = useProductosStore(state => state.camposProducto)
  const setCurrentProductoId = useProductosStore(state=>state.setCurrentProductoId)
  const setShowProductoForm = useProductosStore(state=>state.setShowProductoForm)

  const {
    data: mutation,
    isPending: isPendingMutation,
    deleteProducto,
    setStateProducto,
  } = useMutationProductosQuery<MutationRes>()

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setCurrentProductoId(producto.id)
    setShowProductoForm(true)
  }
  
  const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar al producto ${producto.descripcion}?`,
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
    setStateProducto({estado: producto.estado ? 0 : 1, id: producto.id})
  }

  useEffect(() => {
    if(!mutation) return
    toast(mutation.msg, { type: mutation.msgType})
  }, [mutation])
  
  return (
    <tr className="text-nowrap">
      {camposProducto.filter(el=>el.show).map((el) => {
        switch (el.field_name) {
          case "acciones":{
            return (
              <td key={el.field_name}>
                <div className="d-flex gap-2 justify-content-start position-relative">
                  <div className={`position-absolute w-100 h-100 ${!isPendingMutation ? 'd-none' : ''}`} style={{backgroundColor: "rgb(0,0,0,0.1)"}}></div>
                  <a onClick={handleToEdit} href="#" title="Editar">
                    <FaEdit />
                  </a>
                  <a onClick={handleDelete} href="#" title="Eliminar">
                    <FaTrash className="text-danger"/>
                  </a>
                  {producto.estado == 0
                    ? <div role="button" onClick={toggleEstado} title="Habilitar" data-estado="0">
                        <FaToggleOff className="text-muted" size={"1.3rem"} />
                      </div>
                    : <div role="button" onClick={toggleEstado} title="Deshabilitar" data-estado="1">
                        <FaToggleOn className="text-primary" size={"1.3rem"} />
                      </div>
                  }
                </div>
              </td>
            )
          }
 
          default:{
            return (
              <td key={el.field_name} className={`${producto.estado == 0 ? 'text-body-tertiary' : ''}`}>
                  {producto[el.field_name as keyof Omit<ProductoItem, 'stocks'>]}
              </td>
            )
          }
        }
      })}
    </tr>
  );
}

export default ProductosListItem;
