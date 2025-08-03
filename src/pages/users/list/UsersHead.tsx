const apiDOCS = import.meta.env.VITE_DOCS_URL;
import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Stack,
} from "react-bootstrap";
import { LdsBar } from "../../../core/components/Loaders";
import { FaFileExcel, FaFilePdf, FaFilter } from "react-icons/fa";
import DynaIcon from "../../../core/components/DynaComponents";
import { useDebounce } from "react-use";
import { objToUriBase64 } from "../../../core/utils/funciones";
import { useUsers } from "../context/UsersContext";

type Props = { isFetching: boolean };

export default function UsersHead({ isFetching }: Props) {
  const [inputSearch, setInputSearch] = useState("");

  const {
    stateUsers:{
      filterParamUsersForm,
      infoFilterUsers: { equal, between, order }},
    dispatchUsers
  } = useUsers();

  useDebounce(
    () => {
      if (
        inputSearch.toLowerCase().trim() ==
        filterParamUsersForm.search.toLowerCase().trim()
      ) return;
      dispatchUsers({
        type: 'SET_FILTER_PARAMS_USERS_FORM',
        payload: {
          ...filterParamUsersForm,
          search: inputSearch.trim(),
        },
      });
    },
    500,
    [inputSearch]
  );

  const handleSetShowUsersFilterMdl = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.preventDefault();
    dispatchUsers({
      type: 'SET_SHOW_USERS_FILTER_MDL',
      payload: true,
    });
  };

  const resetEqual = (field_name: string) => {
    if (field_name) {
      let { equal } = filterParamUsersForm;
      equal = equal.filter((el) => el.field_name !== field_name);
      dispatchUsers({
        type: 'SET_FILTER_PARAMS_USERS_FORM',
        payload: { ...filterParamUsersForm, equal: [...equal] },
      });
    }
  };
  const resetBetween = (field_name: string) => {
    let { between } = filterParamUsersForm;
    between = between.filter((el) => el.field_name !== field_name);
    dispatchUsers({
      type: 'SET_FILTER_PARAMS_USERS_FORM',
      payload: { ...filterParamUsersForm, between: [...between] },
    });
  };
  const resetSort = () => {
    dispatchUsers({
      type: 'SET_FILTER_PARAMS_USERS_FORM',
      payload: { ...filterParamUsersForm, order: [] },
    });
  };

  const handleNuevo = () => {
    dispatchUsers({
      type: "SET_CURRENT_USER_ID",
      payload: 0,
    });
    dispatchUsers({
      type: "SET_SHOW_USER_FORM",
      payload: true,
    });
  };

  const handleTraerTodo = () => {
    const param = objToUriBase64(filterParamUsersForm);
    window.open(apiDOCS + "pdf/?action=users_report&p=" + param);
  };

  useEffect(() => {
    setInputSearch(filterParamUsersForm.search);
  }, []);

  return (
    <Container className="mb-2 pt-2 position-relative">
      {isFetching && <LdsBar />}
      <Row className="align-items-center mb-2">
        <Col sm className="text-center text-sm-start">
          <h5>Lista de Usuarios</h5>
        </Col>
        <Col sm className="text-center text-sm-start mb-3 mb-sm-0">
        <InputGroup>
          <Form.Control
            type="search"
            placeholder="Buscar"
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
          />
          <Button
            variant="outline-secondary"
            className="border-secondary-subtle"
            onClick={handleSetShowUsersFilterMdl}
            title="Mostrar filtros"
          >
            <FaFilter />
          </Button>
        </InputGroup>
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
                <FaFileExcel className="fs-5 text-success" />
              </div>
              <div
                role="button"
                className="d-flex align-items-center px-2 boton-icon"
                title="Generar archivo pdf"
                onClick={handleTraerTodo}
              >
                <FaFilePdf className="fs-5 text-danger" />
              </div>
            </div>
            <Button onClick={handleNuevo} variant="primary">
              Nuevo
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="align-items-center">
        <Col className="text-end">
          <div className="d-flex gap-2 flex-wrap">
            {Boolean(equal.length) && (
              <Stack direction="horizontal" gap={2} className="flex-wrap">
                {equal.map((el, idx) => {
                  const value = el.field_label === "Estado" ? el.field_value === "1" ? "Habilitado" : "Deshabilitado" : el.field_value;
                  return (<Badge
                    bg="secondary"
                    role="button"
                    onClick={() => resetEqual(el.field_name)}
                    className="d-flex gap-1"
                    key={idx}
                  >
                    <DynaIcon name="FaCircleXmark" className="pr-4" />
                    <div>
                      {el.field_label}: {value}
                    </div>
                  </Badge>)
})}
              </Stack>
            )}
            {Boolean(between.length) && (
              <Stack direction="horizontal" gap={2} className="flex-wrap">
                {between.map((el, idx) => (
                  <Badge
                    bg="secondary"
                    role="button"
                    onClick={() => resetBetween(el.field_name)}
                    className="d-flex gap-1"
                    key={idx}
                  >
                    <DynaIcon name="FaCircleXmark" className="pr-4" />
                    <div>
                      {`${el.field_label}: de ${el.from.split(" ")[0]} a ${
                        el.to.split(" ")[0]
                      }`}
                    </div>
                  </Badge>
                ))}
              </Stack>
            )}
            {Boolean(order.length) && (
              <Stack direction="horizontal" gap={2} className="flex-wrap">
                <Badge
                  bg="secondary"
                  role="button"
                  className="d-flex gap-1"
                  title="Quitar orden"
                  onClick={resetSort}
                >
                  <DynaIcon name="FaCircleXmark" className="pr-4" />
                  ORDEN:
                  <div className="text-wrap">
                    {order.map((el) => el.field_label).join(", ")}
                  </div>
                </Badge>
              </Stack>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
