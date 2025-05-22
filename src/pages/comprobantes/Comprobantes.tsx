import { Button } from "react-bootstrap";
import useClientesStore from "../../core/store/useClientesStore";
import ClienteFormMdl from "../../core/components/ClienteFormMdl";
import { Cliente } from "../../core/types";

export default function Comprobantes() {
  const setShowClienteFormMdl = useClientesStore(state => state.setShowClienteFormMdl)

  const handleClick = () => {
    setShowClienteFormMdl(true)
  }
  const onChooseCliente = (cliente: Cliente) => {
    console.log(cliente)
  }
  return (
    <div>
      <Button onClick={handleClick}>Nuevo Cliente</Button>
      <ClienteFormMdl onChooseCliente={onChooseCliente}/>
    </div>
  )
}
