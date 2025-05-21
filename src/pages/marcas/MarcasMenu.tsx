import { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, InputGroup, Row, Stack } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { useDebounce } from "react-use";
import { LdsBar } from "../../core/components/Loaders";
import { useFilterMarcasQuery } from "../../core/hooks/useMarcasQuery";
import useMarcasStore, { marcasStoreInit } from "../../core/store/useMarcasStore";
import DynaIcon from "../../core/components/DynaComponents";
import MarcaFrm from "./MarcaFrm";
import { useMarcas } from "./context/MarcasContext";

export default function MarcasMenu() {
  const [inputSearch, setInputSearch] = useState("")
  const filterMarcasCurrent = useMarcasStore(state => state.filterMarcasCurrent)
  const filterParamsMarcas = useMarcasStore(state => state.filterParamsMarcas)
  const setFilterParamsMarcas = useMarcasStore(state => state.setFilterParamsMarcas)
  const {setShowMarcaFrm, setCurrentMarcaId} = useMarcas()
  const {isFetching} = useFilterMarcasQuery();

  useDebounce(() => { 
    if (inputSearch.toLowerCase().trim() == filterParamsMarcas.search.toLowerCase().trim()) return
    setFilterParamsMarcas({ ...filterParamsMarcas, search: inputSearch.trim() });
  }, 500, [inputSearch]);

  const handleUnsort = () => {
    setFilterParamsMarcas({...filterParamsMarcas, orders: marcasStoreInit.filterParamsMarcas.orders})
  };

  const handleNuevo = () => {
    setCurrentMarcaId(0)
    setShowMarcaFrm(true);
  };

  useEffect(()=>{
    setInputSearch(filterParamsMarcas.search)
  }, [])

  return (
    <>
      <Container className="mb-2 pt-2 position-relative" style={{maxWidth: "767.98px"}}>
        {isFetching && <LdsBar />}
        <Row className="align-items-center mb-2">
          <Col sm className="text-center text-sm-start">
            <h5>Lista de Marcas</h5>
          </Col>
          <Col sm className="text-center text-sm-start mb-3 mb-sm-0">
            <InputGroup>
              <Form.Control
                size="sm"
                type="search"
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
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
        <Row className="align-items-center">
          <Col className="text-end">
            <div className="d-flex gap-2 flex-wrap">
              <Stack
                direction="horizontal"
                gap={2}
                className={`${filterMarcasCurrent.orders.length ? "" : "d-none"}`}
              >
                <Badge bg="secondary" role="button" onClick={handleUnsort} className="d-flex gap-1">
                  <DynaIcon name="FaCircleXmark"  className="pr-4" />
                    ORDEN:
                    <div className="text-wrap">
                      {filterMarcasCurrent.orders.map((el) => el.text).join(", ")}
                    </div>
                </Badge>
              </Stack>
            </div>
          </Col>
        </Row>
      </Container>
      <MarcaFrm />
    </>
  )
}
