import { CampoTable, Cliente, ClienteItem, QueryResp} from "../../../app/types";
import { FaEdit, FaToggleOff, FaToggleOn, FaTrash } from "react-icons/fa";
import { useMutationClientesQuery } from "../../../api/queries/useClientesQuery";
import Swal from "sweetalert2";
import useLayoutStore from "../../../app/store/useLayoutStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useClientesStore from "../../../app/store/useClientesStore";

interface Props {
  cliente: ClienteItem ;
  camposCliente: CampoTable[]
}

interface ClienteQryRes extends QueryResp {
  content: Cliente;
}

function ClientesTblRow({ cliente, camposCliente }: Props) {
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  const setCurrentClienteId = useClientesStore(state=>state.setCurrentClienteId)
  const setShowClienteForm = useClientesStore(state=>state.setShowClienteForm)
  const {data, deleteCliente, setStateCliente} = useMutationClientesQuery<ClienteQryRes>()

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setCurrentClienteId(cliente.id)
    setShowClienteForm(true)
  }

  const handleDelete = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    Swal.fire({
      icon: 'question',
      text: `¿Desea eliminar permanentemente a ${cliente.nombre_razon_social}?`,
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
    if (!data) return
    toast(data.msg, {type: data.msgType})
  }, [data])
  
  return (
    <tr className="text-nowrap">
      {camposCliente.map((el) => {
        const {field_name, show} = el
        if(show){
          switch (field_name) {
            case "estado":{
              return <td key={field_name}>
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
                  <div>{cliente[el.field_name as keyof ClienteItem]}</div>
                  <div className="text-muted">
                    {cliente.dis_prov_dep ? <div><small>{cliente.dis_prov_dep}</small></div> :''}
                  </div>
                </td>
              )
            } 
            default:{
              return (
                <td key={field_name}>
                  <div className="text-wrap">
                    {cliente[field_name as keyof ClienteItem]}
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

export default ClientesTblRow;
