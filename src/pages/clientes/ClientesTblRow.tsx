import { Badge } from "react-bootstrap";
import { CampoTable} from "../../core/types";
// import { format, isValid, parseISO } from "date-fns";
import { Cliente } from "../../core/types/clientesTypes";
import useClientesStore from "../../core/store/useClientesStore";
import { FaEdit, FaTrash } from "react-icons/fa";

interface ClientesTblRowProps {
  cliente: Cliente ;
  camposCliente: CampoTable[]
}

function ClientesTblRow({ cliente, camposCliente }: ClientesTblRowProps) {

  const setCurrentClienteId = useClientesStore(state => state.setCurrentClienteId)
  const setShowClienteFormMdl = useClientesStore(state => state.setShowClienteFormMdl)


  // const validDate = (date:string, formato = "dd/MM/yyyy") => {
  //   return isValid(parseISO(date)) ? format(date, formato) : ''
  // }

  const handleToEdit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setCurrentClienteId(cliente.id)
    setShowClienteFormMdl(true)
  }

  return (
    <tr className="text-nowrap">
      {camposCliente.map((el) => {
        const {campo_name, show} = el
        if(show){
          switch (campo_name) {
            case "nro_documento":{
              return (
                <td key={campo_name}>
                  <div>
                    {cliente.tipo_documento + ' ' + cliente[campo_name as keyof Cliente] }
                  </div>
                </td>
              )
            }
            case "nombre_razon_social":{
              return (
                <td key={campo_name} style={{minWidth: "200px"}}>
                  <div className="text-wrap" style={{minWidth: "200px"}}>
                    {cliente[campo_name as keyof Cliente]}
                  </div>
                </td>
              )
            }
            case "direccion":{
              return (
                <td key={campo_name}>
                  <div className="text-wrap">
                    {cliente[campo_name as keyof Cliente]}
                  </div>
                  <small>
                    {cliente.departamento +', '+ cliente.provincia +', '+ cliente.distrito}
                  </small>
                </td>
              )
            }
            case "estado":{
              return <td key={campo_name}> {cliente.estado == 0
                ? <Badge bg="danger">Deshabilitdo</Badge>
                : <Badge bg="success">Habilitado</Badge>} </td>
            }
            case "acciones":{
              return (
                <td key={campo_name} style={{position: "sticky", right: 0, verticalAlign: "middle"} }>
                  <div className="d-flex gap-2 justify-content-center">
                    <a  onClick={handleToEdit} href="#" className="p-1" title="Editar">
                      <FaEdit />
                    </a>
                    <a href="#" className="text-danger p-1" title="Deshabilitar">
                      <FaTrash />
                    </a>
                  </div>
                </td>
              )
            } 
            default:{
              return (
                <td key={campo_name}>
                  <div className="text-wrap">
                    {cliente[campo_name as keyof Cliente]}
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
