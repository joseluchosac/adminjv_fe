import { useEffect, useRef, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { useUsers } from "../context/UsersContext";
import { useFilterUsersQuery } from "../../../core/hooks/useUsersQuery";
import DynaIcon from "../../../core/components/DynaComponents";
import { OrderItem, UserItem } from "../../../core/types";
import { LdsEllipsisCenter } from "../../../core/components/Loaders";
import UsersHead from "./UsersHead";
import UsersLstFilter from "./UsersLstFilter";
import { camposUserInit } from "../../../core/utils/constants";
import UsersLstItem from "./UsersLstItem";


export default function UsersLst() {
  const [ camposUser, setCamposUser] = useState(camposUserInit)
  const {
    stateUsers: { filterParamUsersForm },
    dispatchUsers
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
    const orderIdx = filterParamUsersForm.order.findIndex(el => el.field_name === field_name)
    if(ctrlKey){
      if(orderIdx === -1){
        const newOrder: OrderItem = {field_name, order_dir: "ASC", field_label}
        dispatchUsers({
          type: 'SET_FILTER_PARAMS_USERS_FORM',
          payload: {...filterParamUsersForm, order: [...filterParamUsersForm.order, newOrder]}
        });
      }else{
        let newOrders = structuredClone(filterParamUsersForm.order)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {field_name, order_dir: "DESC", field_label}
          dispatchUsers({
            type: 'SET_FILTER_PARAMS_USERS_FORM',
            payload: {...filterParamUsersForm, order: newOrders}
          });
        }else{
          newOrders = newOrders.filter(el=>el.field_name !== field_name)
          dispatchUsers({
            type: 'SET_FILTER_PARAMS_USERS_FORM',
            payload: {...filterParamUsersForm, order: newOrders}
          });
        }
      }
    }else{
      if(orderIdx === -1){// Si no esta ordenado
        const newOrder: OrderItem = {field_name, order_dir: "ASC", field_label}
        dispatchUsers({
          type: 'SET_FILTER_PARAMS_USERS_FORM',
          payload: {...filterParamUsersForm, order: [newOrder]}
        });
      }else{
        let newOrders = structuredClone(filterParamUsersForm.order)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder: OrderItem = {field_name, order_dir: "DESC", field_label}
          dispatchUsers({
            type: 'SET_FILTER_PARAMS_USERS_FORM',
            payload: {...filterParamUsersForm, order: [newOrder]}
          });
        }else{
          dispatchUsers({
            type: 'SET_FILTER_PARAMS_USERS_FORM',
            payload: {...filterParamUsersForm, order: []}
          });
        }
      }
    }
  };

  const handleNextPage = () => {
    fetchNextPage();
  };

  useEffect(() => {
    setFilterParamsUsers(filterParamUsersForm)
  }, [filterParamUsersForm])

  useEffect(()=>{
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
      return
    }
    if(!isFetching){
      const {search, equal, between, order} = filterParamUsersForm
      dispatchUsers({
        type: 'SET_INFO_FILTER_USERS',
        payload: {search, equal, between, order}
      });
      const newCamposUsers = camposUser.map(el=>{
        const orderh = order.find(order => order.field_name === el.field_name)
        return orderh ? {...el, order_dir: orderh?.order_dir} : {...el, order_dir: ""}
      })
      setCamposUser(newCamposUsers)
    }
  },[data, isError, isFetching])

  return (
    <>
      <UsersHead isFetching={isFetching}/>
      <Card className="overflow-hidden">
        <div className="position-relative">
          <LdsEllipsisCenter innerRef={ldsEllipsisRef} className={`position-absolute ${isFetching ? '' : 'd-none'}`} />
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
                  <UsersLstItem key={user.id} user={user} camposUser={camposUser}/>
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
      <UsersLstFilter isFetching={isFetching} camposUser={camposUser} />
    </>
  )
}
