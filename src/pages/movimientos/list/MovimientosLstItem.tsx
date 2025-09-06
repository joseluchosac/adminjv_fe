import { MovimientoItem, ApiResp} from "../../../app/types";
import { FaEdit  } from "react-icons/fa";
import { useMutationMovimientosQuery } from "../../../api/queries/useMovimientosQuery";
// import useLayoutStore from "../../../app/store/useLayoutStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useMovimientosStore from "../../../app/store/useMovimientosStore";

interface Props {
  movimiento: MovimientoItem ;
}
type MutationRes = ApiResp & {
  movimiento?: MovimientoItem
};
function MovimientosListItem({ movimiento }: Props) {
  // const darkMode = useLayoutStore(state => state.layout.darkMode)
  const camposMovimiento = useMovimientosStore(state => state.camposMovimiento)
  const setShowMovimientoForm = useMovimientosStore(state=>state.setShowMovimientoForm)
  const setCurrentMovimientoId = useMovimientosStore(state=>state.setCurrentMovimientoId)

  const {
    data: mutation,
    isPending: isPendingMutation,
  } = useMutationMovimientosQuery<MutationRes>()

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setShowMovimientoForm(true)
    setCurrentMovimientoId(movimiento.id)
  }
  
  // const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
  //   e.preventDefault()
  //   Swal.fire({
  //     icon: 'question',
  //     text: `¿Desea eliminar al movimiento?`,
  //     showCancelButton: true,
  //     confirmButtonText: "Sí",
  //     cancelButtonText: 'Cancelar',
  //     customClass: { 
  //       popup: darkMode ? 'swal-dark' : ''
  //     }
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       deleteMovimiento(movimiento.id)
  //     }
  //   });
  // }

  // const toggleEstado = () => {
  //   setStateMovimiento({estado: movimiento.estado ? 0 : 1, id: movimiento.id})
  // }

  useEffect(() => {
    if(!mutation) return
    toast(mutation.msg, { type: mutation.msgType})
  }, [mutation])
  
  return (
    <tr className="text-nowrap">
      {camposMovimiento.filter(el=>el.show).map((el) => {
        switch (el.field_name) {
          case "acciones":{
            return (
              <td key={el.field_name}>
                <div className="d-flex gap-2 justify-content-start position-relative">
                  <div className={`position-absolute w-100 h-100 ${!isPendingMutation ? 'd-none' : ''}`} style={{backgroundColor: "rgb(0,0,0,0.1)"}}></div>
                  <a onClick={handleToEdit} href="#" title="Editar">
                    <FaEdit />
                  </a>
                </div>
              </td>
            )
          }
 
          default:{
            return (
              <td key={el.field_name} className={`${movimiento.estado == 0 ? 'text-body-tertiary' : ''}`}>
                  {movimiento[el.field_name as keyof MovimientoItem]}
              </td>
            )
          }
        }
      })}
    </tr>
  );
}

export default MovimientosListItem;
