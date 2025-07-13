import { CampoTable, Proveedor, ProveedorItem, ResponseQuery} from "../../../core/types";
import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { useMutationProveedoresQuery } from "../../../core/hooks/useProveedoresQuery";
import Swal from "sweetalert2";
import useLayoutStore from "../../../core/store/useLayoutStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useProveedoresStore from "../../../core/store/useProveedoresStore";

interface Props {
  proveedor: ProveedorItem ;
  camposProveedor: CampoTable[]
}

interface DataProveedor extends ResponseQuery {
  content: Proveedor;
}

function ProveedoresTblRow({ proveedor, camposProveedor }: Props) {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const setCurrentProveedorId = useProveedoresStore(state=>state.setCurrentProveedorId)
  const setShowProveedorForm = useProveedoresStore(state=>state.setShowProveedorForm)
  const {data, deleteProveedor, setStateProveedor} = useMutationProveedoresQuery<DataProveedor>()

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setCurrentProveedorId(proveedor.id)
    setShowProveedorForm(true)
  }

  const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar permanentemente a ${proveedor.nombre_razon_social}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProveedor(proveedor.id)
      }
    });
  }

  const toggleEstado = () => {
    setStateProveedor(proveedor.estado ? 0 : 1)
  }

  useEffect(() => {
    if (!data) return
    toast(data.msg, {type: data.msgType})
  }, [data])
  
  return (
    <tr className="text-nowrap">
      {camposProveedor.map((el) => {
        const {field_name, show} = el
        if(show){
          switch (field_name) {
            case "estado":{
              return <td key={field_name}>
                {proveedor.estado == 0
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
            case "direccion":{
              return (
                <td 
                  key={field_name}
                  className="text-wrap"
                >
                  <div>{proveedor[el.field_name as keyof ProveedorItem]}</div>
                  <div className="text-muted">
                    {proveedor.dis_prov_dep ? <div><small>{proveedor.dis_prov_dep}</small></div> :''}
                  </div>
                </td>
              )
            } 
            default:{
              return (
                <td key={field_name}>
                  <div className="text-wrap">
                    {proveedor[field_name as keyof ProveedorItem]}
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

export default ProveedoresTblRow;
