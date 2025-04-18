import DynaIcon from "../../core/components/DynaComponents";
import { Table } from "react-bootstrap";
import useClientesStore from "../../core/store/useClientesStore";
import { Cliente } from "../../core/types/clientesTypes";
import ClientesTblRow from "./ClientesTblRow";

interface Props {
  filas: Cliente[];
}

const ClientesTbl: React.FC<Props> = ({filas}) => {
  const camposCliente = useClientesStore(state => state.camposCliente)
  const filterParamsClientes = useClientesStore(state => state.filterParamsClientes)
  const setFilterParamsClientes = useClientesStore(state => state.setFilterParamsClientes)
  
  const handleSort = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    let campo_name = e.currentTarget.dataset.campo as string;
    let text = e.currentTarget.textContent as string;
    const orderIdx = filterParamsClientes.orders.findIndex(el => el.campo_name === campo_name)
    if(e.ctrlKey){
      if(orderIdx === -1){
        const newOrder = {campo_name, order_dir: "ASC", text}
        setFilterParamsClientes({...filterParamsClientes, orders: [...filterParamsClientes.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsClientes.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {campo_name, order_dir: "DESC", text}
          setFilterParamsClientes({...filterParamsClientes, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.campo_name !== campo_name)
          setFilterParamsClientes({...filterParamsClientes, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {campo_name, order_dir: "ASC", text}
        setFilterParamsClientes({...filterParamsClientes, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsClientes.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {campo_name, order_dir: "DESC", text}
          setFilterParamsClientes({...filterParamsClientes, orders: [newOrder]})
        }else{
          setFilterParamsClientes({...filterParamsClientes, orders: []})
        }
      }

    }
  };
 
  return (
    <Table striped hover className="mb-1">
    <thead className="sticky-top">
      <tr className="text-nowrap">
        {camposCliente && camposCliente.map((el) => {
          return ( el.show && (
            <th
              key={el.campo_name}
              onClick={handleSort}
              data-campo={el.campo_name}
              role="button"
              style={el.campo_name=="acciones" ? {position: "sticky", right: 0} : {}}
            >
              <div className="d-flex gap-1">
                <div>{el.text}</div>
                <div>
                  {el.order_dir == "ASC" 
                    ? (<DynaIcon className="text-warning" name="FaArrowDownAZ" />) 
                    : el.order_dir == "DESC"
                      ? (<DynaIcon className="text-warning" name="FaArrowDownZA" />)
                      : ("")
                  }

                </div>
              </div>
            </th>
          ));
        })}
      </tr>
    </thead>
    <tbody>
      {filas && filas.map((cliente: Cliente) => (
        <ClientesTblRow key={cliente.id} cliente={cliente} camposCliente={camposCliente}/>
      ))}
    </tbody>
  </Table>
  )
}

export default ClientesTbl
