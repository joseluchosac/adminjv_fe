import { ProveedorItem, ApiResp} from "../../../app/types";
import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { useMutationProveedoresQuery } from "../../../api/queries/useProveedoresQuery";
import Swal from "sweetalert2";
import useLayoutStore from "../../../app/store/useLayoutStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useProveedoresStore from "../../../app/store/useProveedoresStore";

interface Props {
  proveedor: ProveedorItem ;
}

interface ProveedorMutQryRes extends ApiResp {content: ProveedorItem}

function ProveedoresListItem({ proveedor }: Props) {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const camposProveedor = useProveedoresStore(state => state.camposProveedor)
  const setShowProveedorForm = useProveedoresStore(state=>state.setShowProveedorForm)

  const {
    data: mutation,
    isPending: isPendingMutation,
    setStateProveedor,
    deleteProveedor,
  } = useMutationProveedoresQuery<ProveedorMutQryRes>()

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setShowProveedorForm({showProveedorForm: true, currentProveedorId: proveedor.id})
  }
  
  const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar al proveedor ${proveedor.nombre_razon_social}?`,
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
    if(!mutation) return
    toast(mutation.msg, { type: mutation.msgType})
  }, [mutation])
  
  return (
    <tr className="text-nowrap">
      {camposProveedor.filter(el=>el.show).map((el) => {
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
                </div>
              </td>
            )
          }
          case "estado":{
            return <td key={el.field_name}>
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
           
          case "direccion":{
            return (
              <td 
                key={el.field_name}
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
              <td key={el.field_name}>
                <div className="text-wrap">
                  {proveedor[el.field_name as keyof ProveedorItem]}
                </div>
              </td>
            )
          }
        }
      })}
    </tr>
  );
}

export default ProveedoresListItem;
