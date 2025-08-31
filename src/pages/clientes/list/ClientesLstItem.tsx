import { ClienteItem, ApiResp} from "../../../app/types";
import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { useMutationClientesQuery } from "../../../api/queries/useClientesQuery";
import Swal from "sweetalert2";
import useLayoutStore from "../../../app/store/useLayoutStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useClientesStore from "../../../app/store/useClientesStore";

interface Props {
  cliente: ClienteItem ;
}


interface ClienteMutQryRes extends ApiResp {content: ClienteItem}

function ClientesListItem({ cliente }: Props) {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const camposCliente = useClientesStore(state => state.camposCliente)
  const setShowClienteForm = useClientesStore(state=>state.setShowClienteForm)

  const {
    data: mutation,
    isPending: isPendingMutation,
    setStateCliente,
    deleteCliente,
  } = useMutationClientesQuery<ClienteMutQryRes>()

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setShowClienteForm({showClienteForm: true, currentClienteId: cliente.id})
  }
  
  const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar al cliente ${cliente.nombre_razon_social}?`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: 'Cancelar',
      customClass: { 
        popup: darkMode ? 'swal-dark' : ''
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCliente(cliente.id)
      }
    });
  }

  const toggleEstado = () => {
    setStateCliente(cliente.estado ? 0 : 1)
  }

  useEffect(() => {
    if(!mutation) return
    toast(mutation.msg, { type: mutation.msgType})
  }, [mutation])
  
  return (
    <tr className="text-nowrap">
      {camposCliente.filter(el=>el.show).map((el) => {
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
              {cliente.estado == 0
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
                <div>{cliente[el.field_name as keyof ClienteItem]}</div>
                <div className="text-muted">
                  {cliente.dis_prov_dep ? <div><small>{cliente.dis_prov_dep}</small></div> :''}
                </div>
              </td>
            )
          } 
          default:{
            return (
              <td key={el.field_name}>
                <div className="text-wrap">
                  {cliente[el.field_name as keyof ClienteItem]}
                </div>
              </td>
            )
          }
        }
      })}
    </tr>
  );
}

export default ClientesListItem;
