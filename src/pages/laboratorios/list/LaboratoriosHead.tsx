import { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, InputGroup, Row, Stack } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { useDebounce } from "react-use";
import { LdsBar } from "../../../core/components/Loaders";
import DynaIcon from "../../../core/components/DynaComponents";
import { useLaboratorios } from "../context/LaboratoriosContext";
import { filterParamsInit } from "../../../core/utils/constants";

type Props = { isFetching: boolean }

export default function LaboratoriosHead({isFetching}: Props) {
  const [inputSearch, setInputSearch] = useState("")
  const {
    setShowLaboratorioForm,
    setCurrentLaboratorioId,
    filterInfoLaboratorios,
    filterParamsLaboratoriosForm,
    setFilterParamsLaboratoriosForm
  } = useLaboratorios()

  useDebounce(() => { 
    if (inputSearch.toLowerCase().trim() == filterParamsLaboratoriosForm.search.toLowerCase().trim()) return
    setFilterParamsLaboratoriosForm({ ...filterParamsLaboratoriosForm, search: inputSearch.trim() });
  }, 500, [inputSearch]);

  const handleUnsort = () => {
    setFilterParamsLaboratoriosForm({...filterParamsLaboratoriosForm, orders: filterParamsInit.orders})
  };

  const handleNuevo = () => {
    setCurrentLaboratorioId(0)
    setShowLaboratorioForm(true);
  };

  useEffect(()=>{
    setInputSearch(filterParamsLaboratoriosForm.search)
  }, [])

  return (
    <Container className="mb-2 pt-2 position-relative" style={{maxWidth: "767.98px"}}>
      {isFetching && <LdsBar />}
      <Row className="align-items-center mb-2">
        <Col sm className="text-center text-sm-start">
          <h5>Lista de Laboratorios</h5>
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
              className={`${filterInfoLaboratorios.orders.length ? "" : "d-none"}`}
            >
              <Badge bg="secondary" role="button" onClick={handleUnsort} className="d-flex gap-1">
                <DynaIcon name="FaCircleXmark"  className="pr-4" />
                  ORDEN:
                  <div className="text-wrap">
                    {filterInfoLaboratorios.orders.map((el) => el.field_label).join(", ")}
                  </div>
              </Badge>
            </Stack>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
