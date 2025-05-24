import DynaIcon from "../../core/components/DynaComponents";
import { Table } from "react-bootstrap";
import useProveedoresStore from "../../core/store/useProveedoresStore";
import ProveedoresTblRow from "./ProveedoresTblRow";
import { Proveedor } from "../../core/types";

interface Props {
  filas: Proveedor[];
}

const ProveedoresTbl: React.FC<Props> = ({filas}) => {
  const camposProveedor = useProveedoresStore(state => state.camposProveedor)
  const filterParamsProveedores = useProveedoresStore(state => state.filterParamsProveedores)
  const setFilterParamsProveedores = useProveedoresStore(state => state.setFilterParamsProveedores)
  
  const handleSort = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    let field_name = e.currentTarget.dataset.campo as string;
    let field_label = e.currentTarget.textContent as string;
    const orderIdx = filterParamsProveedores.orders.findIndex(el => el.field_name === field_name)
    if(e.ctrlKey){
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsProveedores({...filterParamsProveedores, orders: [...filterParamsProveedores.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsProveedores.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {field_name, order_dir: "DESC", field_label}
          setFilterParamsProveedores({...filterParamsProveedores, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.field_name !== field_name)
          setFilterParamsProveedores({...filterParamsProveedores, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsProveedores({...filterParamsProveedores, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsProveedores.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {field_name, order_dir: "DESC", field_label}
          setFilterParamsProveedores({...filterParamsProveedores, orders: [newOrder]})
        }else{
          setFilterParamsProveedores({...filterParamsProveedores, orders: []})
        }
      }

    }
  };
 
  return (
    <Table striped hover className="mb-1">
    <thead className="sticky-top">
      <tr className="text-nowrap">
        {camposProveedor && camposProveedor.map((el) => {
          return ( el.show && (
            <th
              key={el.field_name}
              onClick={handleSort}
              data-campo={el.field_name}
              role="button"
              style={el.field_name=="acciones" ? {position: "sticky", left: 0} : {}}
            >
              <div className="d-flex gap-1">
                <div>{el.field_label}</div>
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
      {filas && filas.map((proveedor: Proveedor) => (
        <ProveedoresTblRow key={proveedor.id} proveedor={proveedor} camposProveedor={camposProveedor}/>
      ))}
    </tbody>
  </Table>
  )
}

export default ProveedoresTbl
