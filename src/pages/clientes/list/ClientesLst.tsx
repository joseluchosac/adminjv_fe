import { useEffect, useRef, useState } from "react";
import { Card, Container, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import DynaIcon from "../../../core/components/DynaComponents";
import { LdsBar, LdsEllipsisCenter } from "../../../core/components/Loaders";
import { useFilterClientesQuery } from "../../../core/hooks/useClientesQuery";
import { camposClienteInit } from "../../../core/utils/constants";
import ClientesHead from "./ClientesHead";
import ClientesTblRow from "./ClientesTblRow";
import useClientesStore from "../../../core/store/useClientesStore";

export default function ClientesLst() {
  const [ camposCliente, setCamposCliente ] = useState(camposClienteInit)
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)
  const setFilterInfoClientes = useClientesStore(state => state.setFilterInfoClientes)
  const filterParamsClientesForm = useClientesStore(state => state.filterParamsClientesForm)
  const setFilterParamsClientesForm = useClientesStore(state => state.setFilterParamsClientesForm)

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
  } = useFilterClientesQuery();

  const sort = (field_name:string, field_label: string, ctrlKey: boolean) => {
    const orderIdx = filterParamsClientesForm.orders.findIndex(el => el.field_name === field_name)
    if(ctrlKey){
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsClientesForm({...filterParamsClientesForm, orders: [...filterParamsClientesForm.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsClientesForm.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {field_name, order_dir: "DESC", field_label}
          setFilterParamsClientesForm({...filterParamsClientesForm, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.field_name !== field_name)
          setFilterParamsClientesForm({...filterParamsClientesForm, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsClientesForm({...filterParamsClientesForm, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsClientesForm.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {field_name, order_dir: "DESC", field_label}
          setFilterParamsClientesForm({...filterParamsClientesForm, orders: [newOrder]})
        }else{
          setFilterParamsClientesForm({...filterParamsClientesForm, orders: []})
        }
      }
    }
  };
  
  useEffect(()=>{
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
      return
    }
    if(!isFetching){
      const {search, equals, between, orders} = filterParamsClientesForm
      setFilterInfoClientes({search, equals, between, orders})
      const newCamposClientes = camposCliente.map(el=>{
        const order = orders.find(order => order.field_name === el.field_name)
        return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
      })
      setCamposCliente(newCamposClientes)
    }
  },[data, isError, isFetching])

  return (
    <Container className="position-relative">
      {isFetching && <LdsBar />}
      <ClientesHead />
      <Card className="overflow-hidden mx-auto" >
        <div className="position-relative">
          <div className="table-responsive" style={{ height: "73vh" }} ref={tableRef}>
            {data && 
              <Table striped hover className="mb-1">
                <thead className="sticky-top">
                  <tr className="text-nowrap">
                    {camposCliente && camposCliente.map((el) => {
                      return ( el.show && (
                        <th
                          key={el.field_name}
                          onClick={(e)=>{
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
                      ));
                    })}
                  </tr>
                </thead>
                <tbody>
                  {data && data?.pages.flatMap(el => el.filas).map((cliente) => (
                    <ClientesTblRow key={cliente.id} cliente={cliente} camposCliente={camposCliente}/>
                  ))}
                </tbody>
              </Table>
            }
            <div className="position-relative">
              {hasNextPage &&
                <div className="m-3">
                  <button onClick={()=>fetchNextPage()} className="btn btn-success">Cargar mas registros</button>
                </div>
              }
              {(data?.pages[0].num_regs === 0) && <div>No hay registros para mostrar</div>}
            </div>
          </div>
          {isLoading && <LdsEllipsisCenter innerRef={ldsEllipsisRef}/>}
          {isError && <div className="text-danger">Error de conexion</div>}
        </div>
      </Card>
    </Container>
  )
}
