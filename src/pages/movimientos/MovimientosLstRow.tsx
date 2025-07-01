import { format, isValid, parseISO } from "date-fns";
import { CampoTable, Movimiento } from "../../core/types";
import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { useMutationMovimientosQuery } from "../../core/hooks/useMovimientosQuery";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useMovimientos } from "./hooks/useMovimientos";

interface MovimientosLstRowProps {
  movimiento: Movimiento ;
  camposMovimiento: CampoTable[]
}

function MovimientosLstRow({ movimiento, camposMovimiento }: MovimientosLstRowProps) {
  const {setModo} = useMovimientos()

  const {
    data: mutation,
    isPending: isPendingMutation,
  } = useMutationMovimientosQuery()

  const validDate = (date:string | undefined, formato = "dd/MM/yyyy") => {
    if(!date) return ''
    return isValid(parseISO(date)) ? format(date, formato) : ''
  }

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setModo(prev=>({...prev, vista:"edit", movimientoId:movimiento.id}))
  }

  const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    // Swal.fire({
    //   icon: 'question',
    //   text: `¿Desea eliminar el movimiento ${movimiento.id}?`,
    //   showCancelButton: true,
    //   confirmButtonText: "Sí",
    //   cancelButtonText: 'Cancelar',
    //   customClass: { 
    //     popup: darkMode ? 'swal-dark' : ''
    //   }
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     deleteMovimiento(movimiento.id)
    //   }
    // });
  }

  const toggleEstado = () => {
    // updateEstado({id: movimiento.id, estado: movimiento.estado ? 0 : 1})
  }


  useEffect(() => {
    if(!mutation) return
    toast(mutation.msg, { type: mutation.msgType})
  }, [mutation])

  return (
    <tr className="text-nowrap">
      {camposMovimiento.filter(el=>el.show).map(el => {
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
                  {movimiento.estado == 0
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
          case "created_at": {
            return <td key={el.field_name}>{validDate(movimiento[el.field_name ], 'dd/MM/yyyy')}</td>
          }
          default: {
            return <td key={el.field_name}>{movimiento[el.field_name as keyof Movimiento]}</td>
          }
        }
      })}
    </tr>
  );
}

export default MovimientosLstRow;
