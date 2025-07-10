import { CampoTable, Marca} from "../../../core/types";
import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { useMutationMarcasQuery } from "../../../core/hooks/useMarcasQuery";
import Swal from "sweetalert2";
import useLayoutStore from "../../../core/store/useLayoutStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useMarcas } from "../context/MarcasContext";

interface Props {
  marca: Marca ;
  camposMarca: CampoTable[]
}

function MarcasTblRow({ marca, camposMarca }: Props) {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const {setShowMarcaForm, setCurrentMarcaId} = useMarcas()
  const {data, deleteMarca, updateMarca} = useMutationMarcasQuery()

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setCurrentMarcaId(marca.id)
    setShowMarcaForm(true)
  }

  const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar permanentemente a ${marca.nombre}?`,
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
    updateMarca({...marca, estado: marca.estado ? 0 : 1})
  }

  useEffect(() => {
    if (!data) return
    toast(data.msg, {type: data.msgType})
  }, [data])
  
  return (
    <tr className="text-nowrap">
      {camposMarca.map((el) => {
        const {field_name, show} = el
        if(show){
          switch (field_name) {
            case "estado":{
              return <td key={field_name}>
                {marca.estado == 0
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
                    {marca[field_name as keyof Marca]}
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

export default MarcasTblRow;
