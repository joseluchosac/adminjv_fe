import { useRef } from "react";
import { Card, Table } from "react-bootstrap";
import { useFilterClientesQuery } from "../../../api/queries/useClientesQuery";
import useClientesStore from "../../../app/store/useClientesStore";
import { LdsBar, LdsEllipsisCenter } from "../../../app/components/Loaders";
import DynaIcon from "../../../app/components/DynaComponents";
import ClientesHead from "./ClientesHead";
import { ClientesFilter } from "./ClientesFilter";
import ClientesListItem from "./ClientesLstItem";

export default function ClientesLst() {
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)
  const camposCliente = useClientesStore(state => state.camposCliente)
  const setClienteFilterFormSortTable = useClientesStore(state => state.setClienteFilterFormSortTable)
  
  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
  } = useFilterClientesQuery()
  
  const sort = (field_name:string, field_label: string, ctrlKey: boolean) => {
    setClienteFilterFormSortTable({field_name, field_label, ctrlKey})
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
      <ClientesHead info={info()}/>
      <ClientesFilter isFetching={isFetching} />
      <Card className="overflow-hidden">
        <div className="position-relative">
          <div className="table-responsive" style={{ height: "73vh" }} ref={tableRef}>
            <Table striped hover className="mb-1">
              <thead className="sticky-top">
                <tr className="text-nowrap">
                  {camposCliente && camposCliente.filter(el=>el.show).map((el) => {
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
                {data && data?.pages.flatMap(el => el.filas).map((cliente) => (
                  <ClientesListItem key={cliente.id} cliente={cliente}/>
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
