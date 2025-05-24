import { Badge } from "react-bootstrap";
import { CampoTable, Laboratorio} from "../../core/types";
import useLaboratoriosStore from "../../core/store/useLaboratoriosStore";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useMutationLaboratoriosQuery } from "../../core/hooks/useLaboratoriosQuery";
import Swal from "sweetalert2";
import useLayoutStore from "../../core/store/useLayoutStore";
import { useEffect } from "react";
import { Bounce, toast } from "react-toastify";

interface Props {
  laboratorio: Laboratorio ;
  camposLaboratorio: CampoTable[]
}

function LaboratoriosTblRow({ laboratorio, camposLaboratorio }: Props) {
  const setCurrentLaboratorioId = useLaboratoriosStore(state => state.setCurrentLaboratorioId)
  const setShowLaboratorioFormMdl = useLaboratoriosStore(state => state.setShowLaboratorioFormMdl)
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  
  const {
    data,
    deleteLaboratorio
  } = useMutationLaboratoriosQuery()

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setCurrentLaboratorioId(laboratorio.id)
    setShowLaboratorioFormMdl(true)
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

  useEffect(() => {
    if (!data) return
    toast(data.msg, {
      type: data.msgType,
      autoClose: 3000,
      transition: Bounce,
    })
  }, [data])
  
  return (
    <tr className="text-nowrap">
      {camposLaboratorio.map((el) => {
        const {field_name, show} = el
        if(show){
          switch (field_name) {
            case "estado":{
              return <td key={field_name}> {laboratorio.estado == 0
                ? <Badge bg="danger">Deshabilitdo</Badge>
                : <Badge bg="success">Habilitado</Badge>} </td>
            }
            case "acciones":{
              return (
                <td key={field_name}>
                  <div className="d-flex gap-2 justify-content-start">
                    <a onClick={handleToEdit} href="#" className="p-1" title="Editar">
                      <FaEdit />
                    </a>
                    <a onClick={handleDelete} href="#" className="p-1" title="Eliminar">
                      <FaTrash className="text-danger mb-1"/>
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
