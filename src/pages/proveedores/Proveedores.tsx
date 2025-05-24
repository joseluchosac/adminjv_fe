import { useEffect, useRef, useState } from "react"
import useProveedoresStore, { proveedoresStoreInit } from "../../core/store/useProveedoresStore"
import { useFilterProveedoresQuery } from "../../core/hooks/useProveedoresQuery"
import { useDebounce } from "react-use"
import { Bounce, toast } from "react-toastify"
import { Badge, Button, Card, Col, Container, Dropdown, Form, InputGroup, Row, Stack } from "react-bootstrap"
import { LdsBar, LdsEllipsisCenter } from "../../core/components/Loaders"
import { FaRegFileExcel, FaRegFilePdf, } from "react-icons/fa"
import DynaIcon from "../../core/components/DynaComponents"
import ProveedoresTbl from "./ProveedoresTbl"
import ProveedorFormMdl from "../../core/components/ProveedorFormMdl"
import { BsSearch } from "react-icons/bs"
import { FiFilter } from "react-icons/fi"
import { Proveedor } from "../../core/types"

export default function Proveedores() {
  const filterParamsProveedores = useProveedoresStore(state => state.filterParamsProveedores)
  const setFilterParamsProveedores = useProveedoresStore(state => state.setFilterParamsProveedores)
  const filterProveedoresCurrent = useProveedoresStore(state => state.filterProveedoresCurrent)
  const setFilterProveedoresCurrent = useProveedoresStore(state => state.setFilterProveedoresCurrent)
  const setCurrentProveedorId = useProveedoresStore(state => state.setCurrentProveedorId)
  
  const [inputSearch, setInputSearch] = useState("")
  const [filas, setFilas] = useState<Proveedor[] | null>(null)

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
  } = useFilterProveedoresQuery();


  const setShowProveedorFormMdl = useProveedoresStore(state => state.setShowProveedorFormMdl)
  const setShowProveedoresFilterMdl = useProveedoresStore(state => state.setShowProveedoresFilterMdl)
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)

  useDebounce(() => { 
    if (inputSearch.toLowerCase().trim() == filterParamsProveedores.search.toLowerCase().trim()) return
    setFilterParamsProveedores({ ...filterParamsProveedores, search: inputSearch.trim() });
  }, 500, [inputSearch]);

  const handleNextPage = () => {
    fetchNextPage();
  };

  const onChooseProveedor = (proveedor: Proveedor) => {
    console.log(proveedor)
  }

  const handleInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value)
  };

  const handleUnequal = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const {field_name} = e.currentTarget.dataset
    if(field_name){
      let { equals } = filterParamsProveedores;
      equals = equals.filter(el => el.field_name !== field_name)
      setFilterParamsProveedores({ ...filterParamsProveedores, equals: [...equals] });
    }
  };
  
  const handleUnsort = () => {
    setFilterParamsProveedores({...filterParamsProveedores, orders: proveedoresStoreInit.filterParamsProveedores.orders})
  };

  const handleUnbetween = () => {
    setFilterParamsProveedores({...filterParamsProveedores, between: proveedoresStoreInit.filterParamsProveedores.between})
  }

  const handleNuevo = () => {
    setCurrentProveedorId(0)
    setShowProveedorFormMdl(true);
  };

  const handleShowFilterMdl = () => {
    setShowProveedoresFilterMdl(true);
  };

  const getDateRangeInfo = () => {
    const {between} = filterParamsProveedores
    if(!between.field_name) return ""
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
    setInputSearch(filterParamsProveedores.search)
  }, [])

  useEffect(()=>{
    if(data?.pages[0].error || !data?.pages[0].filas) return
    const newFilas = data?.pages.flatMap(el => el.filas) as Proveedor[];
    setFilas([...newFilas])
  },[data])

  useEffect(()=>{
    if(data?.pages[0].error || isError) return
    if(!isFetching) setFilterProveedoresCurrent()
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
            <h5>Lista de Proveedores</h5>
          </Col>
          <Col sm className="text-center text-sm-start mb-3 mb-sm-0">
            {/* <Form.Control
              type="search"
              placeholder="Buscar"
              value={inputSearch}
              onChange={handleInputSearch}
            /> */}
            <InputGroup>
              <Form.Control
                size="sm"
                type="search"
                value={inputSearch}
                onChange={handleInputSearch}
              />
              <Button variant="outline-secondary" className="px-2 py-1">
                <BsSearch />
              </Button>
            </InputGroup>
          </Col>
          <Col className="text-center flex-sm-grow-0">
            <div className="d-flex justify-content-center align-items-center gap-3">
              <div className="d-flex gap-3">
                <Button 
                  variant="outline-success" 
                  className="px-2 py-1"
                  title="Generar archivo xls"
                  onClick={handleTraerTodo}
                >
                  <FaRegFileExcel />
                </Button>
                <Button 
                  variant="outline-danger" 
                  className="px-2 py-1"
                  title="Generar archivo pdf"
                  onClick={handleTraerTodo}
                >
                  <FaRegFilePdf />
                </Button>
                <Button 
                  variant="outline-secondary" 
                  className="px-2 py-1"
                  title="Filtros"
                  onClick={handleShowFilterMdl}
                >
                  <FiFilter />
                </Button>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" className="px-2 py-1">
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{zIndex:"1030"}}>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
                className={`${filterProveedoresCurrent.orders.length ? "" : "d-none"}`}
              >
                <Badge bg="secondary" role="button" onClick={handleUnsort} className="d-flex gap-1">
                  <DynaIcon name="FaCircleXmark"  className="pr-4" />
                    ORDEN:
                    <div className="text-wrap">
                      {filterProveedoresCurrent.orders.map((el) => el.text).join(", ")}
                    </div>
                </Badge>
              </Stack>
                {(filterProveedoresCurrent.between.field_name.length !== 0) &&
                  <Stack direction="horizontal" gap={2} className="flex-wrap">
                    <Badge bg="secondary" role="button" onClick={handleUnbetween} className="d-flex gap-1">
                      <DynaIcon name="FaCircleXmark"  className="pr-4" />
                      {`${filterProveedoresCurrent.between.campo_text}: `}
                      <div className="text-wrap">{getDateRangeInfo()}</div>
                    </Badge>
                  </Stack>
                }
              <Stack direction="horizontal" gap={2}>
                {filterProveedoresCurrent.equals.map((el, idx) => {
                  return (
                    <Badge 
                      bg="secondary" 
                      role="button" 
                      onClick={handleUnequal} 
                      className="d-flex gap-1" 
                      key={idx}
                      data-field_name={el.field_name}
                    >
                      <DynaIcon name="FaCircleXmark"  className="pr-4" />
                      <div>{el.label_name}: {el.label_value}</div>
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
            {filas && <ProveedoresTbl filas={filas} />}
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
      <ProveedorFormMdl onChooseProveedor={onChooseProveedor}/>
    </>
  )
}
