import { useEffect, useRef, useState } from "react";
import { Card, Container, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import DynaIcon from "../../../core/components/DynaComponents";
import { LdsBar, LdsEllipsisCenter } from "../../../core/components/Loaders";
import { useProveedores } from "../context/ProveedoresContext";
import { useFilterProveedoresQuery } from "../../../core/hooks/useProveedoresQuery";
import { camposProveedorInit } from "../../../core/utils/constants";
import ProveedoresHead from "./ProveedoresHead";
import ProveedoresTblRow from "./ProveedoresTblRow";

export default function ProveedoresLst() {
  const [ camposProveedor, setCamposProveedor ] = useState(camposProveedorInit)
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)
  const {
    setFilterInfoProveedores,
    filterParamsProveedoresForm,
    setFilterParamsProveedoresForm,
  } = useProveedores()

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
    setFilterParamsProveedores
  } = useFilterProveedoresQuery();

  const sort = (field_name:string, field_label: string, ctrlKey: boolean) => {
    const orderIdx = filterParamsProveedoresForm.orders.findIndex(el => el.field_name === field_name)
    if(ctrlKey){
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsProveedoresForm({...filterParamsProveedoresForm, orders: [...filterParamsProveedoresForm.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsProveedoresForm.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {field_name, order_dir: "DESC", field_label}
          setFilterParamsProveedoresForm({...filterParamsProveedoresForm, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.field_name !== field_name)
          setFilterParamsProveedoresForm({...filterParamsProveedoresForm, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsProveedoresForm({...filterParamsProveedoresForm, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsProveedoresForm.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {field_name, order_dir: "DESC", field_label}
          setFilterParamsProveedoresForm({...filterParamsProveedoresForm, orders: [newOrder]})
        }else{
          setFilterParamsProveedoresForm({...filterParamsProveedoresForm, orders: []})
        }
      }
    }
  };

  useEffect(() => {
    setFilterParamsProveedores(filterParamsProveedoresForm)
  }, [filterParamsProveedoresForm])
  
  useEffect(()=>{
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
      return
    }
    if(!isFetching){
      const {search, equals, between, orders} = filterParamsProveedoresForm
      setFilterInfoProveedores({search, equals, between, orders})
      const newCamposProveedores = camposProveedor.map(el=>{
        const order = orders.find(order => order.field_name === el.field_name)
        return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
      })
      setCamposProveedor(newCamposProveedores)
    }
  },[data, isError, isFetching])

  return (
    <Container className="position-relative">
      {isFetching && <LdsBar />}
      <ProveedoresHead />
      <Card className="overflow-hidden mx-auto" >
        <div className="position-relative">
          <div className="table-responsive" style={{ height: "73vh" }} ref={tableRef}>
            {data && 
              <Table striped hover className="mb-1">
                <thead className="sticky-top">
                  <tr className="text-nowrap">
                    {camposProveedor && camposProveedor.map((el) => {
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
                  {data && data?.pages.flatMap(el => el.filas).map((proveedor) => (
                    <ProveedoresTblRow key={proveedor.id} proveedor={proveedor} camposProveedor={camposProveedor}/>
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
