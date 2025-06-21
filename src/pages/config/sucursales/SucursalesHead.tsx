import { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, InputGroup, Row, Stack } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { useDebounce } from "react-use";
import useSucursalesStore from "../../../core/store/useSucursalesStore";
import { useSucursales } from "./context/SucursalesContext";
import { useFilterSucursalesQuery } from "../../../core/hooks/useSucursalesQuery";
import { filterParamsInit } from "../../../core/utils/constants";
import { LdsBar } from "../../../core/components/Loaders";
import DynaIcon from "../../../core/components/DynaComponents";

export default function SucursalesHead() {
  const [inputSearch, setInputSearch] = useState("")
  const filterParamsSucursales = useSucursalesStore(state => state.filterParamsSucursales)
  const setFilterParamsSucursales = useSucursalesStore(state => state.setFilterParamsSucursales)
  const {setShowSucursalForm, setCurrentSucursalId, filterSucursalesCurrent} = useSucursales()
  const {isFetching} = useFilterSucursalesQuery();

  useDebounce(() => { 
    if (inputSearch.toLowerCase().trim() == filterParamsSucursales.search.toLowerCase().trim()) return
    setFilterParamsSucursales({ ...filterParamsSucursales, search: inputSearch.trim() });
  }, 500, [inputSearch]);

  const handleUnsort = () => {
    setFilterParamsSucursales({...filterParamsSucursales, orders: filterParamsInit.orders})
  };

  const handleNuevo = () => {
    setCurrentSucursalId(0)
    setShowSucursalForm(true);
  };

  useEffect(()=>{
    setInputSearch(filterParamsSucursales.search)
  }, [])

  return (
    <Container className="mb-2 pt-2 position-relative">
      {isFetching && <LdsBar />}
      <Row className="align-items-center mb-2">
        <Col sm className="text-center text-sm-start">
          <h5>Lista de Sucursales</h5>
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
              className={`${filterSucursalesCurrent.orders.length ? "" : "d-none"}`}
            >
              <Badge bg="secondary" role="button" onClick={handleUnsort} className="d-flex gap-1">
                <DynaIcon name="FaCircleXmark"  className="pr-4" />
                  ORDEN:
                  <div className="text-wrap">
                    {filterSucursalesCurrent.orders.map((el) => el.field_label).join(", ")}
                  </div>
              </Badge>
            </Stack>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
