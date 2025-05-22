import { User } from "../../core/types";
import UsersTblRow from "./UsersTblRow";
import useUsersStore from "../../core/store/useUsersStore";
import DynaIcon from "../../core/components/DynaComponents";
import { Table } from "react-bootstrap";

interface Props {
  filas: User[];
}

const UsersTbl: React.FC<Props> = ({filas}) => {
  const camposUser = useUsersStore(state => state.camposUser)
  const filterParamsUsers = useUsersStore(state => state.filterParamsUsers)
  const setFilterParamsUsers = useUsersStore(state => state.setFilterParamsUsers)
  
  const handleSort = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    let fieldname = e.currentTarget.dataset.campo as string;
    let text = e.currentTarget.textContent as string;
    const orderIdx = filterParamsUsers.orders.findIndex(el => el.fieldname === fieldname)
    if(e.ctrlKey){
      if(orderIdx === -1){
        const newOrder = {fieldname, order_dir: "ASC", text}
        setFilterParamsUsers({...filterParamsUsers, orders: [...filterParamsUsers.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsUsers.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {fieldname, order_dir: "DESC", text}
          setFilterParamsUsers({...filterParamsUsers, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.fieldname !== fieldname)
          setFilterParamsUsers({...filterParamsUsers, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {fieldname, order_dir: "ASC", text}
        setFilterParamsUsers({...filterParamsUsers, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsUsers.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {fieldname, order_dir: "DESC", text}
          setFilterParamsUsers({...filterParamsUsers, orders: [newOrder]})
        }else{
          setFilterParamsUsers({...filterParamsUsers, orders: []})
        }
      }

    }
  };
 
  return (
    <Table striped hover className="mb-1">
    <thead className="sticky-top">
      <tr className="text-nowrap">
        {camposUser && camposUser.map((el) => {
          return ( el.show && (
            <th
              key={el.fieldname}
              onClick={handleSort}
              data-campo={el.fieldname}
              role="button"
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
      {filas && filas.map((user: User) => (
        <UsersTblRow key={user.id} user={user} camposUser={camposUser}/>
      ))}
    </tbody>
  </Table>
  )
}

export default UsersTbl
