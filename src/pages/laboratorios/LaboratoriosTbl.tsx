import DynaIcon from "../../core/components/DynaComponents";
import { Table } from "react-bootstrap";
import useLaboratoriosStore from "../../core/store/useLaboratoriosStore";
import LaboratoriosTblRow from "./LaboratoriosTblRow";
import { Laboratorio } from "../../core/types";

interface Props {
  filas: Laboratorio[];
}

const LaboratoriosTbl: React.FC<Props> = ({filas}) => {
  const camposLaboratorio = useLaboratoriosStore(state => state.camposLaboratorio)
  const filterParamsLaboratorios = useLaboratoriosStore(state => state.filterParamsLaboratorios)
  const setFilterParamsLaboratorios = useLaboratoriosStore(state => state.setFilterParamsLaboratorios)
  
  const handleSort = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    let field_name = e.currentTarget.dataset.campo as string;
    let field_label = e.currentTarget.textContent as string;
    const orderIdx = filterParamsLaboratorios.orders.findIndex(el => el.field_name === field_name)
    if(e.ctrlKey){
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsLaboratorios({...filterParamsLaboratorios, orders: [...filterParamsLaboratorios.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsLaboratorios.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {field_name, order_dir: "DESC", field_label}
          setFilterParamsLaboratorios({...filterParamsLaboratorios, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.field_name !== field_name)
          setFilterParamsLaboratorios({...filterParamsLaboratorios, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsLaboratorios({...filterParamsLaboratorios, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsLaboratorios.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {field_name, order_dir: "DESC", field_label}
          setFilterParamsLaboratorios({...filterParamsLaboratorios, orders: [newOrder]})
        }else{
          setFilterParamsLaboratorios({...filterParamsLaboratorios, orders: []})
        }
      }

    }
  };
 
  return (
    <Table striped hover className="mb-1">
    <thead className="sticky-top">
      <tr className="text-nowrap">
        {camposLaboratorio && camposLaboratorio.map((el) => {
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
      {filas && filas.map((laboratorio: Laboratorio) => (
        <LaboratoriosTblRow key={laboratorio.id} laboratorio={laboratorio} camposLaboratorio={camposLaboratorio}/>
      ))}
    </tbody>
  </Table>
  )
}

export default LaboratoriosTbl
