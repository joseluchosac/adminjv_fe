import { useEffect, useRef, useState } from "react"
import useClientesStore, { clientesStoreInit } from "../../core/store/useClientesStore"
import {type Cliente } from "../../core/types/clientesTypes"
import { useFilterClientesQuery } from "../../core/hooks/useClientesQuery"
import { useDebounce } from "react-use"
import { Bounce, toast } from "react-toastify"
import { Badge, Button, Card, Col, Container, Form, Row, Stack } from "react-bootstrap"
import { LdsBar, LdsEllipsisCenter } from "../../core/components/Loaders"
import { FaFileExcel, FaFilePdf } from "react-icons/fa"
import DynaIcon from "../../core/components/DynaComponents"
import ClientesTbl from "./ClientesTbl"
import ClienteFormMdl from "../../core/components/ClienteFormMdl"

export default function Clientes() {
  const filterParamsClientes = useClientesStore(state => state.filterParamsClientes)
  const setFilterParamsClientes = useClientesStore(state => state.setFilterParamsClientes)
  const filterClientesCurrent = useClientesStore(state => state.filterClientesCurrent)
  const setFilterClientesCurrent = useClientesStore(state => state.setFilterClientesCurrent)
  const setCurrentClienteId = useClientesStore(state => state.setCurrentClienteId)
  
  const [inputSearch, setInputSearch] = useState("")
  const [filas, setFilas] = useState<Cliente[] | null>(null)

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
  } = useFilterClientesQuery();


  const setShowClienteFormMdl = useClientesStore(state => state.setShowClienteFormMdl)
  const setShowClientesFilterMdl = useClientesStore(state => state.setShowClientesFilterMdl)
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)

  useDebounce(() => { 
    if (inputSearch.toLowerCase().trim() == filterParamsClientes.search.toLowerCase().trim()) return
    setFilterParamsClientes({ ...filterParamsClientes, search: inputSearch.trim() });
  }, 1000, [inputSearch]);

  const handleNextPage = () => {
    fetchNextPage();
  };

  const onChooseCliente = (cliente: Cliente) => {
    console.log(cliente)
  }
  const handleInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value)
  };

  const handleUnequal = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const {campo_name} = e.currentTarget.dataset
    if(campo_name){
      let { equals } = filterParamsClientes;
      equals = equals.filter(el => el.campo_name !== campo_name)
      setFilterParamsClientes({ ...filterParamsClientes, equals: [...equals] });
    }
  };
  
  const handleUnsort = () => {
    setFilterParamsClientes({...filterParamsClientes, orders: clientesStoreInit.filterParamsClientes.orders})
  };

  const handleUnbetween = () => {
    setFilterParamsClientes({...filterParamsClientes, between: clientesStoreInit.filterParamsClientes.between})
  }

  const handleNuevo = () => {
    setCurrentClienteId(0)
    setShowClienteFormMdl(true);
  };

  const handleShowFilterMdl = () => {
    setShowClientesFilterMdl(true);
  };

  const getDateRangeInfo = () => {
    const {between} = filterParamsClientes
    if(!between.campo_name) return ""
    let date_from = between.range.split(",")[0].split(" ")[0]
    let date_to = between.range.split(",")[1].trim().split(" ")[0]
    date_from = date_from.split("-").reverse().join("/")
    date_to = date_to.split("-").reverse().join("/")
    let range = (date_from == date_to)
      ? date_from 
      : `Entre ${date_from} y ${date_to}`
    return range
  }

  const handleTraerTodo = () => {
    // const param = objToUriBase64(filterParamsUsers)
    // window.open(beURL+"docs/pdf/?action=users_report&p=" + param)
  }


  useEffect(()=>{
    setInputSearch(filterParamsClientes.search)
  }, [])

  useEffect(()=>{
    if(data?.pages[0].error || !data?.pages[0].filas) return
    const newFilas = data?.pages.flatMap(el => el.filas) as Cliente[];
    setFilas([...newFilas])
  },[data])

  useEffect(()=>{
    if(data?.pages[0].error || isError) return
    if(!isFetching) setFilterClientesCurrent()
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
    <>
      <Container className="mb-2 pt-2 position-relative">
        {isFetching && <LdsBar />}
        <Row className="align-items-center">
          <Col sm className="text-center text-sm-start">
            <h5>Lista de Clientes</h5>
          </Col>
          <Col sm className="text-center text-sm-start mb-3 mb-sm-0">
            <Form.Control
              type="search"
              placeholder="Buscar"
              value={inputSearch}
              onChange={handleInputSearch}
            />
          </Col>
          <Col className="text-center flex-sm-grow-0">
            <div className="d-flex justify-content-center align-items-center gap-3">
              <div className="d-flex">
                <div 
                  role="button" 
                  className="d-flex align-items-center px-2 boton-icon"
                  title="Generar archivo xls"
                  onClick={handleTraerTodo}
                >
                  <FaFileExcel className="fs-5 text-success"/>
                </div>
                <div 
                  role="button" 
                  className="d-flex align-items-center px-2 boton-icon" 
                  title="Generar archivo pdf"
                  onClick={handleTraerTodo}
                >
                  <FaFilePdf className="fs-5 text-danger"/>
                </div>
              </div>
              <div
                role="button"
                onClick={handleShowFilterMdl}
                className="px-1"
                title="Filtros"
              >
                <DynaIcon name="FaEllipsisV" />
              </div>
              <Button onClick={handleNuevo} variant="primary">
                Nuevo
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="position-relative mb-2 overflow-hidden">
        <Row className="align-items-center">
          <Col className="text-end">
            <div className="d-flex gap-2 flex-wrap">
              <Stack
                direction="horizontal"
                gap={2}
                className={`${filterClientesCurrent.orders.length ? "" : "d-none"}`}
              >
                <Badge bg="secondary" role="button" onClick={handleUnsort} className="d-flex gap-1">
                  <DynaIcon name="FaCircleXmark"  className="pr-4" />
                    ORDEN:
                    <div className="text-wrap">
                      {filterClientesCurrent.orders.map((el) => el.text).join(", ")}
                    </div>
                </Badge>
              </Stack>
                {(filterClientesCurrent.between.campo_name.length !== 0) &&
                  <Stack direction="horizontal" gap={2} className="flex-wrap">
                    <Badge bg="secondary" role="button" onClick={handleUnbetween} className="d-flex gap-1">
                      <DynaIcon name="FaCircleXmark"  className="pr-4" />
                      {`${filterClientesCurrent.between.campo_text}: `}
                      <div className="text-wrap">{getDateRangeInfo()}</div>
                    </Badge>
                  </Stack>
                }
              <Stack direction="horizontal" gap={2}>
                {filterClientesCurrent.equals.map((el, idx) => {
                  return (
                    <Badge 
                      bg="secondary" 
                      role="button" 
                      onClick={handleUnequal} 
                      className="d-flex gap-1" 
                      key={idx}
                      data-campo_name={el.campo_name}
                    >
                      <DynaIcon name="FaCircleXmark"  className="pr-4" />
                      <div>{el.campo_text}: {el.text}</div>
                    </Badge>
                  )
                })}
              </Stack>
            </div>
          </Col>
        </Row>
      </div>
      <Card className="overflow-hidden">
        <div className="position-relative">
          <div className="table-responsive" style={{ height: "73vh" }} ref={tableRef}>
            {filas && <ClientesTbl filas={filas} />}
            <div className="position-relative">
              {hasNextPage &&
                <div className="m-3">
                  <button onClick={handleNextPage} className="btn btn-success">Cargar mas registros</button>
                </div>
              }
              {(filas?.length === 0) && <div>No hay registros para mostrar</div>}
            </div>
          </div>
          {isLoading && <LdsEllipsisCenter innerRef={ldsEllipsisRef}/>}
          {isError && <div className="text-danger">Error de conexion</div>}
        </div>
      </Card>
      {/* <UsersLstFilterMdl /> */}
      <ClienteFormMdl onChooseCliente={onChooseCliente}/>
    </>
  )
}
