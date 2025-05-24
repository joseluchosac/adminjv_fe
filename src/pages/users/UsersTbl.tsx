import { useEffect, useRef } from "react";
import { Card, Table } from "react-bootstrap";
import { Bounce, toast } from "react-toastify";
import { User } from "../../core/types";
import UsersTblRow from "./UsersTblRow";
import useUsersStore from "../../core/store/useUsersStore";
import DynaIcon from "../../core/components/DynaComponents";
import { useFilterUsersQuery } from "../../core/hooks/useUsersQuery";
import { LdsEllipsisCenter } from "../../core/components/Loaders";
import { useUsers } from "./context/UsersContext";


const UsersTbl: React.FC = () => {
  const camposUser = useUsersStore(state => state.camposUser)
  const setCamposUser = useUsersStore(state => state.setCamposUser)
  const filterParamsUsers = useUsersStore(state => state.filterParamsUsers)
  const setFilterParamsUsers = useUsersStore(state => state.setFilterParamsUsers)
  const {users, setUsers, setFilterUsersCurrent,} = useUsers()
  
  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
  } = useFilterUsersQuery();
  
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)

  const handleSort = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    if (e.currentTarget.dataset.orderable !== "true") return
    let field_name = e.currentTarget.dataset.campo as string;
    let text = e.currentTarget.textContent as string;
    const orderIdx = filterParamsUsers.orders.findIndex(el => el.field_name === field_name)
    if(e.ctrlKey){
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", text}
        setFilterParamsUsers({...filterParamsUsers, orders: [...filterParamsUsers.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsUsers.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {field_name, order_dir: "DESC", text}
          setFilterParamsUsers({...filterParamsUsers, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.field_name !== field_name)
          setFilterParamsUsers({...filterParamsUsers, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", text}
        setFilterParamsUsers({...filterParamsUsers, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsUsers.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {field_name, order_dir: "DESC", text}
          setFilterParamsUsers({...filterParamsUsers, orders: [newOrder]})
        }else{
          setFilterParamsUsers({...filterParamsUsers, orders: []})
        }
      }

    }
  };
  const handleNextPage = () => {
    fetchNextPage();
  };


  useEffect(()=>{
    if(data?.pages[0].error || !data?.pages[0].content) return
    const newUsers = data?.pages.flatMap(el => el.content) as User[];
    setUsers([...newUsers])
  },[data])

  useEffect(()=>{
    if(data?.pages[0].error || isError) return
    if(!isFetching) {
      const {equals, between, orders} = filterParamsUsers
      setFilterUsersCurrent({equals, between, orders})
      const newCamposMarcas = camposUser.map(el=>{
        const order = orders.find(order => order.field_name === el.field_name)
        return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
      })
      setCamposUser(newCamposMarcas)
    }
  },[data, isFetching])

  useEffect(() => {
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros", {
        autoClose: 3000,
        transition: Bounce,
      })
    }
  }, [data, isError])
  
  return (
    <Card className="overflow-hidden">
      <div className="position-relative">
        <div className="table-responsive" style={{ height: "73vh" }} ref={tableRef}>
          <Table striped hover className="mb-1">
            <thead className="sticky-top">
              <tr className="text-nowrap">
                {camposUser && camposUser.filter(el=>el.show).map((el) => {
                  return (
                    <th
                      key={el.field_name}
                      onClick={handleSort}
                      data-orderable={el.orderable}
                      data-campo={el.field_name}
                      role={el.orderable ? "button" : "columnheader"}
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
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {users && users.map((user: User) => (
                <UsersTblRow key={user.id} user={user} camposUser={camposUser}/>
              ))}
            </tbody>
          </Table>
          <div className="position-relative">
            {hasNextPage &&
              <div className="m-3">
                <button onClick={handleNextPage} className="btn btn-success">Cargar mas registros</button>
              </div>
            }
            {(users?.length === 0) && <div>No hay registros para mostrar</div>}
          </div>
        </div>
        {isLoading && <LdsEllipsisCenter innerRef={ldsEllipsisRef}/>}
        {isError && <div className="text-danger">Error de conexion</div>}
      </div>
    </Card>
  )
}

export default UsersTbl
