import { useEffect, useState } from "react";
import { Badge, Button, Col, Form, InputGroup, Row, Stack } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { useDebounce } from "react-use";
import DynaIcon from "../../../core/components/DynaComponents";
import { useProveedores } from "../context/ProveedoresContext";
import { filterParamsInit } from "../../../core/utils/constants";
import useProveedoresStore from "../../../core/store/useProveedoresStore";

export default function ProveedoresHead() {
  const [inputSearch, setInputSearch] = useState("")
  const setShowProveedorForm = useProveedoresStore(state => state.setShowProveedorForm)
  const setCurrentProveedorId = useProveedoresStore(state => state.setCurrentProveedorId)
  const {
    filterInfoProveedores,
    filterParamsProveedoresForm,
    setFilterParamsProveedoresForm
  } = useProveedores()

  useDebounce(() => { 
    if (inputSearch.toLowerCase().trim() == filterParamsProveedoresForm.search.toLowerCase().trim()) return
    setFilterParamsProveedoresForm({ ...filterParamsProveedoresForm, search: inputSearch.trim() });
  }, 500, [inputSearch]);

  const handleUnsort = () => {
    setFilterParamsProveedoresForm({...filterParamsProveedoresForm, orders: filterParamsInit.orders})
  };

  const handleNuevo = () => {
    setCurrentProveedorId(0)
    setShowProveedorForm(true);
  };

  useEffect(()=>{
    setInputSearch(filterParamsProveedoresForm.search)
  }, [])


  return (
    <div className="mb-2 pt-2">
      <Row className="align-items-center mb-2">
        <Col sm className="text-center text-sm-start">
          <h5>Lista de Proveedores</h5>
        </Col>
        <Col sm className="text-center text-sm-start mb-3 mb-sm-0">
          <InputGroup>
            <Form.Control
              size="sm"
              name="search"
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
              className={`${filterInfoProveedores.orders.length ? "" : "d-none"}`}
            >
              <Badge bg="secondary" role="button" onClick={handleUnsort} className="d-flex gap-1">
                <DynaIcon name="FaCircleXmark"  className="pr-4" />
                  ORDEN:
                  <div className="text-wrap">
                    {filterInfoProveedores.orders.map((el) => el.field_label).join(", ")}
                  </div>
              </Badge>
            </Stack>
          </div>
        </Col>
      </Row>
    </div>
  )
}
