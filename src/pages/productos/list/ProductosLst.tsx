import { useEffect, useRef, useState } from "react";
import { Card, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { camposProductoInit } from "../../../core/utils/constants";
import { useProductos } from "../context/ProductosContext";
import { useFilterProductosQuery } from "../../../core/hooks/useProductosQuery";
import DynaIcon from "../../../core/components/DynaComponents";
import ProductosLstRow from "./ProductosLstRow";
import { LdsEllipsisCenter } from "../../../core/components/Loaders";
import ProductosHead from "./ProductosHead";
import ProductosLstFilterMdl from "./ProductosLstFilterMdl";


const ProductosLst: React.FC = () => {
  const [camposProducto, setCamposProducto] = useState(camposProductoInit)
  
  const {
    setFilterInfoProductos,
    filterParamsProductosForm,
    setFilterParamsProductosForm,
    modo
  } = useProductos()

  const {
    data,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
    fetchNextPage,
    setFilterParamsProductos,
  } = useFilterProductosQuery();
  
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)

  const sort = (field_name:string, field_label: string, ctrlKey: boolean) => {
    const orderIdx = filterParamsProductosForm.orders.findIndex(el => el.field_name === field_name)
    if(ctrlKey){
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsProductosForm({...filterParamsProductosForm, orders: [...filterParamsProductosForm.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsProductosForm.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {field_name, order_dir: "DESC", field_label}
          setFilterParamsProductosForm({...filterParamsProductosForm, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.field_name !== field_name)
          setFilterParamsProductosForm({...filterParamsProductosForm, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsProductosForm({...filterParamsProductosForm, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsProductosForm.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {field_name, order_dir: "DESC", field_label}
          setFilterParamsProductosForm({...filterParamsProductosForm, orders: [newOrder]})
        }else{
          setFilterParamsProductosForm({...filterParamsProductosForm, orders: []})
        }
      }

    }
  };
  const handleNextPage = () => {
    fetchNextPage();
  };

  useEffect(() => {
    setFilterParamsProductos(filterParamsProductosForm)
  }, [filterParamsProductosForm])

  useEffect(()=>{
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
      return
    }
    if(!isFetching){
      const {search, equals, between, orders} = filterParamsProductosForm
      setFilterInfoProductos({search, equals, between, orders})
      const newCamposProductos = camposProducto.map(el=>{
        const order = orders.find(order => order.field_name === el.field_name)
        return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
      })
      setCamposProducto(newCamposProductos)
    }
  },[data, isError, isFetching])


  return (
    <>
      <ProductosHead isFetching={isFetching} />
      <Card className={`overflow-hidden ${modo.vista === "edit" ? "d-none" : ""}`}>
        <div className="position-relative">
          <div className="table-responsive" style={{ height: "73vh" }} ref={tableRef}>
            <Table striped hover className="mb-1">
              <thead className="sticky-top">
                <tr className="text-nowrap">
                  {camposProducto && camposProducto.filter(el=>el.show).map((el) => {
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
                {data && data?.pages.flatMap(el => el.filas).map((producto) => (
                  <ProductosLstRow key={producto.id} producto={producto} camposProducto={camposProducto}/>
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
      <ProductosLstFilterMdl isFetching={isFetching} camposProducto={camposProducto} />
    </>
  )
}

export default ProductosLst
