import { useEffect, useRef, useState } from "react"
import useLaboratoriosStore, { laboratoriosStoreInit } from "../../core/store/useLaboratoriosStore"
import { Laboratorio } from "../../core/types"
import { useFilterLaboratoriosQuery } from "../../core/hooks/useLaboratoriosQuery"
import { useDebounce } from "react-use"
import { toast } from "react-toastify"
import { Badge, Button, Card, Col, Container, Form, InputGroup, Row, Stack } from "react-bootstrap"
import { LdsBar, LdsEllipsisCenter } from "../../core/components/Loaders"
import { BsSearch } from "react-icons/bs"
import DynaIcon from "../../core/components/DynaComponents"
import LaboratoriosTbl from "./LaboratoriosTbl"
import LaboratorioFormMdl from "../../core/components/LaboratorioFormMdl"

export default function Laboratorios() {
  const filterParamsLaboratorios = useLaboratoriosStore(state => state.filterParamsLaboratorios)
  const setFilterParamsLaboratorios = useLaboratoriosStore(state => state.setFilterParamsLaboratorios)
  const filterLaboratoriosCurrent = useLaboratoriosStore(state => state.filterLaboratoriosCurrent)
  const setFilterLaboratoriosCurrent = useLaboratoriosStore(state => state.setFilterLaboratoriosCurrent)
  const setCurrentLaboratorioId = useLaboratoriosStore(state => state.setCurrentLaboratorioId)
  
  const [inputSearch, setInputSearch] = useState("")
  const [filas, setFilas] = useState<Laboratorio[] | null>(null)

  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    hasNextPage,
  } = useFilterLaboratoriosQuery();


  const setShowLaboratorioFormMdl = useLaboratoriosStore(state => state.setShowLaboratorioFormMdl)
  const tableRef = useRef<HTMLDivElement | null>(null)
  const ldsEllipsisRef = useRef<HTMLDivElement | null>(null)

  useDebounce(() => { 
    if (inputSearch.toLowerCase().trim() == filterParamsLaboratorios.search.toLowerCase().trim()) return
    setFilterParamsLaboratorios({ ...filterParamsLaboratorios, search: inputSearch.trim() });
  }, 500, [inputSearch]);

  const handleNextPage = () => {
    fetchNextPage();
  };

  const onChooseLaboratorio = (laboratorio: Laboratorio) => {
    console.log(laboratorio)
  }

  const handleInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value)
  };

  const handleUnsort = () => {
    setFilterParamsLaboratorios({...filterParamsLaboratorios, orders: laboratoriosStoreInit.filterParamsLaboratorios.orders})
  };

  const handleNuevo = () => {
    setCurrentLaboratorioId(0)
    setShowLaboratorioFormMdl(true);
  };

  useEffect(()=>{
    setInputSearch(filterParamsLaboratorios.search)
  }, [])

  useEffect(()=>{
    if(data?.pages[0].error || !data?.pages[0].filas) return
    const newFilas = data?.pages.flatMap(el => el.filas) as Laboratorio[];
    setFilas([...newFilas])
  },[data])

  useEffect(()=>{
    if(data?.pages[0].error || isError) return
    if(!isFetching) setFilterLaboratoriosCurrent()
  },[data, isFetching])

  useEffect(() => {
    if(data?.pages[0].error || isError){
      toast.error("Error al obtener registros")
    }
  }, [data, isError])

  return (
    <>
      <Container className="mb-2 pt-2 position-relative" style={{maxWidth: "767.98px"}}>
        {isFetching && <LdsBar />}
        <Row className="align-items-center">
          <Col sm className="text-center text-sm-start">
            <h5>Lista de Laboratorios</h5>
          </Col>
          <Col sm className="text-center text-sm-start mb-3 mb-sm-0">
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
              <Button onClick={handleNuevo} variant="primary">
                Nuevo
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <Container className="mb-2 position-relative" style={{maxWidth: "767.98px"}}>
        <Row className="align-items-center">
          <Col className="text-end">
            <div className="d-flex gap-2 flex-wrap">
              <Stack
                direction="horizontal"
                gap={2}
                className={`${filterLaboratoriosCurrent.orders.length ? "" : "d-none"}`}
              >
                <Badge bg="secondary" role="button" onClick={handleUnsort} className="d-flex gap-1">
                  <DynaIcon name="FaCircleXmark"  className="pr-4" />
                    ORDEN:
                    <div className="text-wrap">
                      {filterLaboratoriosCurrent.orders.map((el) => el.field_name).join(", ")}
                    </div>
                </Badge>
              </Stack>

            </div>
          </Col>
        </Row>
      </Container>
      <Card className="overflow-hidden mx-auto" style={{maxWidth: "767.98px"}}>
        <div className="position-relative">
          <div className="table-responsive" style={{ height: "73vh" }} ref={tableRef}>
            {filas && <LaboratoriosTbl filas={filas} />}
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
      <LaboratorioFormMdl onChooseLaboratorio={onChooseLaboratorio}/>
    </>
  )
}
