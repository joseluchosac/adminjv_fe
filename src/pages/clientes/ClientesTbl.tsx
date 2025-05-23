import DynaIcon from "../../core/components/DynaComponents";
import { Table } from "react-bootstrap";
import useClientesStore from "../../core/store/useClientesStore";
import ClientesTblRow from "./ClientesTblRow";
import { Cliente } from "../../core/types";

interface Props {
  filas: Cliente[];
}

const ClientesTbl: React.FC<Props> = ({filas}) => {
  const camposCliente = useClientesStore(state => state.camposCliente)
  const filterParamsClientes = useClientesStore(state => state.filterParamsClientes)
  const setFilterParamsClientes = useClientesStore(state => state.setFilterParamsClientes)
  
  const handleSort = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    let fieldname = e.currentTarget.dataset.campo as string;
    let text = e.currentTarget.textContent as string;
    const orderIdx = filterParamsClientes.orders.findIndex(el => el.fieldname === fieldname)
    if(e.ctrlKey){
      if(orderIdx === -1){
        const newOrder = {fieldname, order_dir: "ASC", text}
        setFilterParamsClientes({...filterParamsClientes, orders: [...filterParamsClientes.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsClientes.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {fieldname, order_dir: "DESC", text}
          setFilterParamsClientes({...filterParamsClientes, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.fieldname !== fieldname)
          setFilterParamsClientes({...filterParamsClientes, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {fieldname, order_dir: "ASC", text}
        setFilterParamsClientes({...filterParamsClientes, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsClientes.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {fieldname, order_dir: "DESC", text}
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
              key={el.fieldname}
              onClick={handleSort}
              data-campo={el.fieldname}
              role="button"
              style={el.fieldname=="acciones" ? {position: "sticky", left: 0} : {}}
            >
              <div className="d-flex gap-1">
                <div>{el.label}</div>
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
