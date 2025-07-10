import { useEffect, useRef } from "react";
import { Card, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { ProductoItem } from "../../core/types";
import ProductosLstRow from "./ProductosLstRow";
import useProductosStore from "../../core/store/useProductosStore";
import DynaIcon from "../../core/components/DynaComponents";
import { useFilterProductosQuery } from "../../core/hooks/useProductosQuery";
import { LdsEllipsisCenter } from "../../core/components/Loaders";
import { useProductos } from "./context/ProductosContext";


const ProductosLst: React.FC = () => {
  const camposProducto = useProductosStore(state => state.camposProducto)
  const setCamposProducto = useProductosStore(state => state.setCamposProducto)
  const filterParamsProductos = useProductosStore(state => state.filterParamsProductos)
  const setFilterParamsProductos = useProductosStore(state => state.setFilterParamsProductos)
  const {productos, setProductos, setFilterProductosCurrent, modo} = useProductos()
  
  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
  } = useFilterProductosQuery();
  
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)

  const handleSort = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    if (e.currentTarget.dataset.orderable !== "true") return
    let field_name = e.currentTarget.dataset.campo as string;
    let field_label = e.currentTarget.textContent as string;
    const orderIdx = filterParamsProductos.orders.findIndex(el => el.field_name === field_name)
    if(e.ctrlKey){
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsProductos({...filterParamsProductos, orders: [...filterParamsProductos.orders, newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsProductos.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          newOrders[orderIdx] = {field_name, order_dir: "DESC", field_label}
          setFilterParamsProductos({...filterParamsProductos, orders: newOrders})
        }else{
          newOrders = newOrders.filter(el=>el.field_name !== field_name)
          setFilterParamsProductos({...filterParamsProductos, orders: newOrders})
        }
      }
    }else{
      if(orderIdx === -1){
        const newOrder = {field_name, order_dir: "ASC", field_label}
        setFilterParamsProductos({...filterParamsProductos, orders: [newOrder]})
      }else{
        let newOrders = structuredClone(filterParamsProductos.orders)
        if(newOrders[orderIdx].order_dir == "ASC"){
          const newOrder = {field_name, order_dir: "DESC", field_label}
          setFilterParamsProductos({...filterParamsProductos, orders: [newOrder]})
        }else{
          setFilterParamsProductos({...filterParamsProductos, orders: []})
        }
      }

    }
  };
  const handleNextPage = () => {
    fetchNextPage();
  };


  useEffect(()=>{
    if(data?.pages[0].error || !data?.pages[0].filas) return
    const newProductos = data?.pages.flatMap(el => el.filas);
    setProductos([...newProductos])
  },[data])

  useEffect(()=>{
    if(data?.pages[0].error || isError) return
    if(!isFetching) {
      const {equals, between, orders} = filterParamsProductos
      setFilterProductosCurrent({equals, between, orders})
      const newCamposMarcas = camposProducto.map(el=>{
        const order = orders.find(order => order.field_name === el.field_name)
        return order ? {...el, order_dir: order?.order_dir} : {...el, order_dir: ""}
      })
      setCamposProducto(newCamposMarcas)
    }
  },[data, isFetching])

  useEffect(() => {
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
    }
  }, [data, isError])

  return (
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
                      onClick={handleSort}
                      data-orderable={el.orderable}
                      data-campo={el.field_name}
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
              {productos && productos.map((producto: ProductoItem) => (
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
            {(productos?.length === 0) && <div>No hay registros para mostrar</div>}
          </div>
        </div>
        {isLoading && <LdsEllipsisCenter innerRef={ldsEllipsisRef}/>}
        {isError && <div className="text-danger">Error de conexion</div>}
      </div>
    </Card>
  )
}

export default ProductosLst
