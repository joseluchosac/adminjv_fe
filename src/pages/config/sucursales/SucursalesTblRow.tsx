import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSucursales } from "./context/SucursalesContext";
import { Sucursal } from "../../../core/types/catalogosTypes";
import { CampoTable } from "../../../core/types";
import useLayoutStore from "../../../core/store/useLayoutStore";
import { useMutationSucursalesQuery } from "../../../core/hooks/useSucursalesQuery";

interface Props {
  sucursal: Sucursal ;
  camposSucursal: CampoTable[]
}

function SucursalesTblRow({ sucursal, camposSucursal }: Props) {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const {setShowSucursalForm, setCurrentSucursalId} = useSucursales()
  const {data, deleteSucursal, updateSucursal} = useMutationSucursalesQuery()

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setCurrentSucursalId(sucursal.id)
    setShowSucursalForm(true)
  }

  const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar la sucursal: ${sucursal.descripcion}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSucursal(sucursal.id)
      }
    });
  }

  const toggleEstado = () => {
    updateSucursal({...sucursal, estado: sucursal.estado ? 0 : 1})
  }

  useEffect(() => {
    if (!data) return
    toast(data.msg, {type: data.msgType})
  }, [data])
  
  return (
    <tr className="text-nowrap">
      {camposSucursal.map((el) => {
        const {field_name, show} = el
        if(show){
          switch (field_name) {
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
            case "estado":{
              return <td key={field_name}>
                {sucursal.estado == 0
                  ? <div role="button" onClick={toggleEstado} title="Habilitar" data-estado="0">
                      <FaToggleOff className="text-muted" size={"1.3rem"} />
                    </div>
                  : <div role="button" onClick={toggleEstado} title="Deshabilitar" data-estado="1">
                      <FaToggleOn className="text-primary" size={"1.3rem"} />
                    </div>
                }
                </td>
            }
            case "direccion":{
              return (
                <td key={field_name}>
                  <div>{sucursal[field_name as keyof Sucursal]}</div>
                  <div>{sucursal.dis_prov_dep}</div>
                </td>
              )
            }
            default:{
              return (
                <td key={field_name}>
                  <div className="text-wrap">
                    {sucursal[field_name as keyof Sucursal]}
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

export default SucursalesTblRow;
