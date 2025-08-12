import { useEffect, useRef, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import LaboratoriosHead from "./LaboratoriosHead";
import DynaIcon from "../../../app/components/DynaComponents";
import { LdsEllipsisCenter } from "../../../app/components/Loaders";
import { useLaboratorios } from "../context/LaboratoriosContext";
import { useFilterLaboratoriosQuery } from "../../../api/queries/useLaboratoriosQuery";
import { camposLaboratorioInit } from "../../../app/utils/constants";
import LaboratoriosTblRow from "./LaboratoriosTblRow";

export default function LaboratoriosLst() {
  const [ camposLaboratorio, setCamposLaboratorio] = useState(camposLaboratorioInit)
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)
  const {
    setFilterInfoLaboratorios,
    filterParamsLaboratoriosForm,
    setFilterParamsLaboratoriosForm,
  } = useLaboratorios()

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
    setFilterParamsLaboratorios
  } = useFilterLaboratoriosQuery();

  const sort = (field_name:string, field_label: string, ctrlKey: boolean) => {
    const orderIdx = filterParamsLaboratoriosForm.orders.findIndex(el => el.field_name === field_name)
    if(ctrlKey){
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsLaboratoriosForm({...filterParamsLaboratoriosForm, orders: [...filterParamsLaboratoriosForm.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsLaboratoriosForm.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {field_name, order_dir: "DESC", field_label}
          setFilterParamsLaboratoriosForm({...filterParamsLaboratoriosForm, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.field_name !== field_name)
          setFilterParamsLaboratoriosForm({...filterParamsLaboratoriosForm, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsLaboratoriosForm({...filterParamsLaboratoriosForm, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsLaboratoriosForm.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {field_name, order_dir: "DESC", field_label}
          setFilterParamsLaboratoriosForm({...filterParamsLaboratoriosForm, orders: [newOrder]})
        }else{
          setFilterParamsLaboratoriosForm({...filterParamsLaboratoriosForm, orders: []})
        }
      }
    }
  };

  useEffect(() => {
    setFilterParamsLaboratorios(filterParamsLaboratoriosForm)
  }, [filterParamsLaboratoriosForm])
  
  useEffect(()=>{
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
      return
    }
    if(!isFetching){
      const {search, equals, between, orders} = filterParamsLaboratoriosForm
      setFilterInfoLaboratorios({search, equals, between, orders})
      const newCamposLaboratorios = camposLaboratorio.map(el=>{
        const order = orders.find(order => order.field_name === el.field_name)
        return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
      })
      setCamposLaboratorio(newCamposLaboratorios)
    }
  },[data, isError, isFetching])

  return (
    <>
      <LaboratoriosHead isFetching={isFetching}/>
      <Card className="overflow-hidden mx-auto" style={{maxWidth: "767.98px"}}>
        <div className="position-relative">
          <div className="table-responsive" style={{ height: "73vh" }} ref={tableRef}>
            {data && 
              <Table striped hover className="mb-1">
                <thead className="sticky-top">
                  <tr className="text-nowrap">
                    {camposLaboratorio && camposLaboratorio.map((el) => {
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
                  {data && data?.pages.flatMap(el => el.filas).map((laboratorio) => (
                    <LaboratoriosTblRow key={laboratorio.id} laboratorio={laboratorio} camposLaboratorio={camposLaboratorio}/>
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
    </>
  )
}
