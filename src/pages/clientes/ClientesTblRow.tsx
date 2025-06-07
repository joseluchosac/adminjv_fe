import { Badge, NavDropdown } from "react-bootstrap";
import { CampoTable, Cliente} from "../../core/types";
import useClientesStore from "../../core/store/useClientesStore";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useMutationClientesQuery } from "../../core/hooks/useClientesQuery";
import Swal from "sweetalert2";
import useLayoutStore from "../../core/store/useLayoutStore";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  cliente: Cliente ;
  camposCliente: CampoTable[]
}

function ClientesTblRow({ cliente, camposCliente }: Props) {
  const setCurrentClienteId = useClientesStore(state => state.setCurrentClienteId)
  const setShowClienteFormMdl = useClientesStore(state => state.setShowClienteFormMdl)
  const darkMode = useLayoutStore(state => state.layout.darkMode)
  
  const {
    data,
    deleteCliente
  } = useMutationClientesQuery()

  // const validDate = (date:string, formato = "dd/MM/yyyy") => {
  //   return isValid(parseISO(date)) ? format(date, formato) : ''
  // }

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setCurrentClienteId(cliente.id)
    setShowClienteFormMdl(true)
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
            case "nro_documento":{
              return (
                <td key={field_name}>
                  <div>
                    {cliente.tipo_documento + ' ' + cliente[field_name as keyof Cliente] }
                  </div>
                </td>
              )
            }
            case "nombre_razon_social":{
              return (
                <td key={field_name} style={{minWidth: "200px"}}>
                  <div className="text-wrap" style={{minWidth: "200px"}}>
                    {cliente[field_name as keyof Cliente]}
                  </div>
                </td>
              )
            }
            case "direccion":{
              return (
                <td key={field_name}>
                  <div className="text-wrap">
                    {cliente[field_name as keyof Cliente]}
                  </div>
                  <small>
                    {cliente.departamento +', '+ cliente.provincia +', '+ cliente.distrito}
                  </small>
                </td>
              )
            }
            case "estado":{
              return <td key={field_name}> {cliente.estado == 0
                ? <Badge bg="danger">Deshabilitdo</Badge>
                : <Badge bg="success">Habilitado</Badge>} </td>
            }
            case "acciones":{
              return (
                <td key={field_name}>
                  <div className="d-flex gap-2 justify-content-center">
                    <NavDropdown title={<div className="p-1"></div>}>
                      <NavDropdown.Item onClick={handleDelete}  className="d-flex gap-2 align-middle" href="#">
                        <div><FaTrash className="text-danger mb-1" /></div>
                        <div>Eliminar</div>
                      </NavDropdown.Item>
                    </NavDropdown>
                    <a onClick={handleToEdit} href="#" className="p-1" title="Editar">
                      <FaEdit />
                    </a>
                  </div>
                </td>
              )
            } 
            default:{
              return (
                <td key={field_name}>
                  <div className="text-wrap">
                    {cliente[field_name as keyof Cliente]}
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
