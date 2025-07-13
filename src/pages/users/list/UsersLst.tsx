import { useEffect, useRef, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { useUsers } from "../context/UsersContext";
import { useFilterUsersQuery } from "../../../core/hooks/useUsersQuery";
import DynaIcon from "../../../core/components/DynaComponents";
import { UserItem } from "../../../core/types";
import { LdsEllipsisCenter } from "../../../core/components/Loaders";
import UsersHead from "./UsersHead";
import UsersTblRow from "./UsersTblRow";
import UsersLstFilterMdl from "./UsersLstFilterMdl";
import { camposUserInit } from "../../../core/utils/constants";


export default function UsersLst() {
  const [ camposUser, setCamposUser] = useState(camposUserInit)
  const {
    setFilterInfoUsers,
    filterParamsUsersForm,
    setFilterParamsUsersForm,
  } = useUsers()
  
  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
    setFilterParamsUsers
  } = useFilterUsersQuery();
  
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)

  const sort = (field_name:string, field_label: string, ctrlKey: boolean) => {
    const orderIdx = filterParamsUsersForm.orders.findIndex(el => el.field_name === field_name)
    if(ctrlKey){
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsUsersForm({...filterParamsUsersForm, orders: [...filterParamsUsersForm.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsUsersForm.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {field_name, order_dir: "DESC", field_label}
          setFilterParamsUsersForm({...filterParamsUsersForm, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.field_name !== field_name)
          setFilterParamsUsersForm({...filterParamsUsersForm, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsUsersForm({...filterParamsUsersForm, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsUsersForm.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {field_name, order_dir: "DESC", field_label}
          setFilterParamsUsersForm({...filterParamsUsersForm, orders: [newOrder]})
        }else{
          setFilterParamsUsersForm({...filterParamsUsersForm, orders: []})
        }
      }
    }
  };

  const handleNextPage = () => {
    fetchNextPage();
  };

  useEffect(() => {
    setFilterParamsUsers(filterParamsUsersForm)
  }, [filterParamsUsersForm])

  useEffect(()=>{
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
      return
    }
    if(!isFetching){
      const {search, equals, between, orders} = filterParamsUsersForm
      setFilterInfoUsers({search, equals, between, orders})
      const newCamposUsers = camposUser.map(el=>{
        const order = orders.find(order => order.field_name === el.field_name)
        return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
      })
      setCamposUser(newCamposUsers)
    }
  },[data, isError, isFetching])

  return (
    <>
      <UsersHead isFetching={isFetching}/>
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
                        onClick={(e) => {
                          if(!el.orderable) return
                          sort(el.field_name, el.field_label, e.ctrlKey)
                        }}
                        role={el.orderable ? "button" : "columnheader"}
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
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {data && data?.pages.flatMap(el => el.filas).map((user: UserItem) => (
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
              {(data?.pages[0].num_regs === 0) && <div>No hay registros para mostrar</div>}
            </div>
          </div>
          {isLoading && <LdsEllipsisCenter innerRef={ldsEllipsisRef}/>}
          {isError && <div className="text-danger">Error de conexion</div>}
        </div>
      </Card>
      <UsersLstFilterMdl isFetching={isFetching} camposUser={camposUser} />
    </>
  )
}
