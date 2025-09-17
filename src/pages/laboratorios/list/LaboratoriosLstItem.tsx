import { LaboratorioItem, ApiResp} from "../../../app/types";
import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { useMutationLaboratoriosQuery } from "../../../api/queries/useLaboratoriosQuery";
import Swal from "sweetalert2";
import useLayoutStore from "../../../app/store/useLayoutStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useLaboratoriosStore from "../../../app/store/useLaboratoriosStore";
import { useNavigate } from "react-router-dom";

interface Props {
  laboratorio: LaboratorioItem ;
}
type MutationRes = ApiResp & {
  laboratorio?: LaboratorioItem
};
function LaboratoriosListItem({ laboratorio }: Props) {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const camposLaboratorio = useLaboratoriosStore(state => state.camposLaboratorio)
  const navigate = useNavigate()

  const {
    data: mutation,
    isPending: isPendingMutation,
    deleteLaboratorio,
    setStateLaboratorio,
  } = useMutationLaboratoriosQuery<MutationRes>()

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    navigate(`${location.pathname}?edit=${laboratorio.id}`);
  }
  
  const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar al laboratorio ${laboratorio.nombre}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLaboratorio(laboratorio.id)
      }
    });
  }

  const toggleEstado = () => {
    setStateLaboratorio({estado: laboratorio.estado ? 0 : 1, id: laboratorio.id})
  }

  useEffect(() => {
    if(!mutation) return
    toast(mutation.msg, { type: mutation.msgType})
  }, [mutation])
  
  return (
    <tr className="text-nowrap">
      {camposLaboratorio.filter(el=>el.show).map((el) => {
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
                  {laboratorio.estado == 0
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
              <td key={el.field_name} className={`${laboratorio.estado == 0 ? 'text-body-tertiary' : ''}`}>
                  {laboratorio[el.field_name as keyof LaboratorioItem]}
              </td>
            )
          }
        }
      })}
    </tr>
  );
}

export default LaboratoriosListItem;
