import { useRef } from "react";
import { Card, Table } from "react-bootstrap";
import { useMovimientosFilterQuery } from "../../../api/queries/useMovimientosQuery";
import { LdsBar, LdsEllipsisCenter } from "../../../app/components/Loaders";
import DynaIcon from "../../../app/components/DynaComponents";
import MovimientosListItem from "./MovimientosLstItem";
import MovimientosHead from "./MovimientosHead";
import useMovimientosStore from "../../../app/store/useMovimientosStore";
import { MovimientosFilter } from "./MovimientosFilter";

export default function MovimientosLst() {
  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
  } = useMovimientosFilterQuery()
  
  const camposMovimiento = useMovimientosStore(state => state.camposMovimiento)
  const setMovimientoFilterFormSortTable = useMovimientosStore(state => state.setMovimientoFilterFormSortTable)
  
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)

  const sort = (field_name:string, field_label: string, ctrlKey: boolean) => {
    setMovimientoFilterFormSortTable({field_name, field_label, ctrlKey})
  };

  const info = () => {
    let mostrando  = data?.pages.reduce((acum, curval)=>{
      return acum + curval.filas.length
    },0)
    const total = data?.pages[0]?.num_regs || 0
    return total ? `${mostrando} de ${total} reg` : ' '
  }

  const handleNextPage = () => {fetchNextPage()};


  return (
    <div className="position-relative">
      {isFetching && <LdsBar />}
      <MovimientosHead info={info()}/>
      <MovimientosFilter isFetching={isFetching} />
      <Card className="overflow-hidden">
        <div className="position-relative">
          <div className="table-responsive" style={{ height: "73vh" }} ref={tableRef}>
            <Table striped hover className="mb-1">
              <thead className="sticky-top">
                <tr className="text-nowrap">
                  {camposMovimiento && camposMovimiento.filter(el=>el.show).map((el) => {
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
                {data && data?.pages.flatMap(el => el.filas).map((movimiento) => (
                  <MovimientosListItem key={movimiento.id} movimiento={movimiento}/>
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
    </div>
  )
}
