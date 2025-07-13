import { CampoTable, Laboratorio} from "../../../core/types";
import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { useMutationLaboratoriosQuery } from "../../../core/hooks/useLaboratoriosQuery";
import Swal from "sweetalert2";
import useLayoutStore from "../../../core/store/useLayoutStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useLaboratorios } from "../context/LaboratoriosContext";

interface Props {
  laboratorio: Laboratorio ;
  camposLaboratorio: CampoTable[]
}

function LaboratoriosTblRow({ laboratorio, camposLaboratorio }: Props) {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const {setShowLaboratorioForm, setCurrentLaboratorioId} = useLaboratorios()
  const {data, deleteLaboratorio, updateLaboratorio} = useMutationLaboratoriosQuery()

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setCurrentLaboratorioId(laboratorio.id)
    setShowLaboratorioForm(true)
  }

  const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar permanentemente a ${laboratorio.nombre}?`,
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
    updateLaboratorio({...laboratorio, estado: laboratorio.estado ? 0 : 1})
  }

  useEffect(() => {
    if (!data) return
    toast(data.msg, {type: data.msgType})
  }, [data])
  
  return (
    <tr className="text-nowrap">
      {camposLaboratorio.map((el) => {
        const {field_name, show} = el
        if(show){
          switch (field_name) {
            case "estado":{
              return <td key={field_name}>
                {laboratorio.estado == 0
                  ? <div role="button" onClick={toggleEstado} title="Habilitar" data-estado="0">
                      <FaToggleOff className="text-muted" size={"1.3rem"} />
                    </div>
                  : <div role="button" onClick={toggleEstado} title="Deshabilitar" data-estado="1">
                      <FaToggleOn className="text-primary" size={"1.3rem"} />
                    </div>
                }
                </td>
            }
            case "acciones":{
              return (
                <td key={field_name}>
                  <div className="d-flex gap-2 justify-content-start">
                    <a onClick={handleToEdit} href="#" className="p-1" title="Editar">
                      <FaEdit />
                    </a>
                    <a onClick={handleDelete} href="#" className="p-1" title="Eliminar">
                      <FaTrash className="text-danger"/>
                    </a>
                  </div>
                </td>
              )
            } 
            default:{
              return (
                <td key={field_name}>
                  <div className="text-wrap">
                    {laboratorio[field_name as keyof Laboratorio]}
                  </div>
                </td>
              )
            }
          }
        }
      })}
    </tr>
  );
}

export default LaboratoriosTblRow;
