import { Badge } from "react-bootstrap";
import { CampoTable} from "../../core/types";
// import { format, isValid, parseISO } from "date-fns";
import { Cliente } from "../../core/types/clientesTypes";
import useClientesStore from "../../core/store/useClientesStore";

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

  const handleToEdit = () => {
    setCurrentClienteId(cliente.id)
    setShowClienteFormMdl(true)
  }

  return (
    <tr className="text-nowrap" onClick={handleToEdit}>
      {camposCliente.map(el => {
        const {campo_name, show} = el

        if(show){
          if(campo_name === "estado"){
            return <td key={campo_name}> {cliente.estado == 0
              ? <Badge bg="danger">Deshabilitdo</Badge>
              : <Badge bg="success">Habilitado</Badge>} </td>
          }else {
            return <td key={campo_name}>{cliente[campo_name as keyof Cliente]}</td>
          }
        }
      })}
    </tr>
  );
}

export default ClientesTblRow;
