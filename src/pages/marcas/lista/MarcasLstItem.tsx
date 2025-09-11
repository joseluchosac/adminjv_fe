import { ApiResp, MarcaItem} from "../../../app/types";
import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { useMutationMarcasQuery } from "../../../api/queries/useMarcasQuery";
import Swal from "sweetalert2";
import useLayoutStore from "../../../app/store/useLayoutStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useMarcasStore from "../../../app/store/useMarcasStore";

interface Props {
  marca: MarcaItem ;
}

function MarcasListItem({ marca }: Props) {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const camposMarca = useMarcasStore(state => state.camposMarca)
  const setShowMarcaForm = useMarcasStore(state=>state.setShowMarcaForm)

  const {
    data: mutation,
    isPending: isPendingMutation,
    deleteMarca,
    setStateMarca,
  } = useMutationMarcasQuery<ApiResp>()

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setShowMarcaForm({showMarcaForm: true, currentMarcaId: marca.id})
  }
  
  const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar al marca ${marca.nombre}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMarca(marca.id)
      }
    });
  }

  const toggleEstado = () => {
    setStateMarca({estado: marca.estado ? 0 : 1, id: marca.id})
  }

  useEffect(() => {
    if(!mutation) return
    toast(mutation.msg, { type: mutation.msgType})
  }, [mutation])
  
  return (
    <tr className="text-nowrap">
      {camposMarca.filter(el=>el.show).map((el) => {
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
                  {marca.estado == 0
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
              <td key={el.field_name} className={`${marca.estado == 0 ? 'text-body-tertiary' : ''}`}>
                  {marca[el.field_name as keyof MarcaItem]}
              </td>
            )
          }
        }
      })}
    </tr>
  );
}

export default MarcasListItem;
