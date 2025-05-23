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
    let fieldname = e.currentTarget.dataset.campo as string;
    let text = e.currentTarget.textContent as string;
    const orderIdx = filterParamsLaboratorios.orders.findIndex(el => el.fieldname === fieldname)
    if(e.ctrlKey){
      if(orderIdx === -1){
        const newOrder = {fieldname, order_dir: "ASC", text}
        setFilterParamsLaboratorios({...filterParamsLaboratorios, orders: [...filterParamsLaboratorios.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsLaboratorios.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {fieldname, order_dir: "DESC", text}
          setFilterParamsLaboratorios({...filterParamsLaboratorios, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.fieldname !== fieldname)
          setFilterParamsLaboratorios({...filterParamsLaboratorios, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {fieldname, order_dir: "ASC", text}
        setFilterParamsLaboratorios({...filterParamsLaboratorios, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsLaboratorios.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {fieldname, order_dir: "DESC", text}
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
      {filas && filas.map((laboratorio: Laboratorio) => (
        <LaboratoriosTblRow key={laboratorio.id} laboratorio={laboratorio} camposLaboratorio={camposLaboratorio}/>
      ))}
    </tbody>
  </Table>
  )
}

export default LaboratoriosTbl
