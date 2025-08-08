import Modal from "react-bootstrap/Modal";
import { Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { useMemo, useRef, useState } from "react";
import { useUsers } from "../context/UsersContext";
import { CommonPeriod, EqualItem } from "../../../core/types";
import { LdsBar } from "../../../core/components/Loaders";
import { useCajasQuery } from "../../../core/hooks/useCatalogosQuery";
import { useRolesQuery } from "../../../core/hooks/useRolesQuery";
import { commonPeriods } from "../../../core/utils/constants";

type Props = {
  isFetching: boolean;
}
const UsersLstFilter: React.FC<Props> = ({isFetching}) => {
  const [tabName, setTabName] = useState("order")
  const {roles} = useRolesQuery()
  const {cajas} = useCajasQuery()
  const orderRef = useRef<HTMLSelectElement | null>(null)
  const orderDirRef = useRef<HTMLSelectElement | null>(null)

  const {
    stateUsers: { showUsersFilter, userFilterForm, camposUser },
    dispatchUsers
  } = useUsers()

  const sort = () => {
    const field_name = orderRef.current?.value || ""
    const field_label = orderRef.current?.options[orderRef.current?.selectedIndex].textContent || ""
    const order_dir = orderDirRef.current?.value as "ASC" | "DESC"
    dispatchUsers({
      type: 'SET_USER_FILTER_FORM_SORT',
      payload: {field_name, field_label, order_dir}
    });
  }

  const equals = useMemo(() => {
    const equalsInit = {
      rol: userFilterForm.equal.find(el => el.field_name === "rol")?.field_value || "",
      caja: userFilterForm.equal.find(el => el.field_name === "caja")?.field_value || "",
      estado: userFilterForm.equal.find(el => el.field_name === "estado")?.field_value || ""
    }
    return equalsInit
  }, [userFilterForm.equal]);

  const filterEqual = ({field_name, field_value, field_label}: EqualItem) => {
    dispatchUsers({
      type: 'SET_USER_FILTER_FORM_EQUAL',
      payload: { field_name, field_value, field_label }
    });
  }

  const handleFilterField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const field_name = e.currentTarget.value;
    const field_label = e.currentTarget.options[e.currentTarget.selectedIndex].textContent || ""
    dispatchUsers({
      type: 'SET_USER_FILTER_FORM_BETWEEN_FIELD',
      payload: { field_name, field_label }
    });
  };

  const filterPeriod = (periodKey: CommonPeriod["key"]) => {
    dispatchUsers({
      type: 'SET_USER_FILTER_FORM_BETWEEN_PERIOD',
      payload: { periodKey }
    });
  }

  const handleFilterDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    dispatchUsers({
      type: 'SET_USER_FILTER_FORM_BETWEEN_DATE',
      payload: { name, value }
    });
  };


  return (
    <Modal 
      show={showUsersFilter} 
      onHide={()=>
        dispatchUsers({
          type: 'SET_SHOW_USER_FILTER',
          payload: false,
        })
      }
    >
      <Modal.Header closeButton className="py-2">
        <Modal.Title>Filtros</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isFetching && <LdsBar />}
        <Tabs
          activeKey={tabName}
          onSelect={(k) => setTabName(k as string)}
          className="mb-3"
        >
          <Tab eventKey="order" title="Ordenar">
            <Row>
              <Form.Group as={Col} sm={8} className="mb-3">
                <Form.Label htmlFor="f_order">Ordenar por</Form.Label>
                <Form.Select
                  ref={orderRef}
                  id="f_order"
                  name="order"
                  value={userFilterForm.order.length ? userFilterForm.order[0].field_name : ""}
                  onChange={()=> sort()}
                >
                  <option value="">Ninguno</option>
                  {camposUser && camposUser.filter(el=>el.orderable).map(el=>{
                    return <option key={el.field_name} value={el.field_name}>{el.field_label}</option>
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} sm={4} className="mb-3">
                <Form.Label htmlFor="f_order_dir">Dir</Form.Label>
                <Form.Select
                  ref={orderDirRef}
                  disabled={!Boolean(userFilterForm.order.length)}
                  id="f_order_dir"
                  name="order_dir"
                  value={userFilterForm.order.length ? userFilterForm.order[0].order_dir : "ASC"}
                  onChange={()=> sort()}
                >
                  <option value="ASC">Ascendente</option>
                  <option value="DESC">Descendente</option>
                </Form.Select>
              </Form.Group>
            </Row>
          </Tab>
          <Tab eventKey="equal" title="Igual a">
            <Form>
              <Form.Group as={Col} className="mb-3">
                <Form.Label htmlFor="f_rol">Rol</Form.Label>
                <Form.Select
                  id="f_rol"
                  value={equals.rol as string}
                  onChange={(e)=>{
                    filterEqual({
                      field_name:'rol',
                      field_value: e.target.value,
                      field_label: "Rol"
                    })
                  }}
                >
                  <option value="">Todos</option>
                  {roles?.map((el) => (
                    <option key={el.id} value={el.rol}>
                      {el.rol}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} className="mb-3">
                <Form.Label htmlFor="f_caja">Caja</Form.Label>
                <Form.Select
                  id="f_caja"
                  value={equals.caja as string}
                  onChange={(e)=>{
                    filterEqual({
                      field_name:'caja',
                      field_value: e.target.value,
                      field_label: "Caja"
                    })
                  }}
                >
                  <option value="">Todos</option>
                  {cajas?.map((el) => (
                    <option key={el.id} value={el.descripcion}>
                      {el.descripcion}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} className="mb-3">
                <Form.Label htmlFor="f_estado">Estado</Form.Label>
                <Form.Select
                  id="f_estado"
                  name="estado"
                  value={equals.estado as string}
                  onChange={(e)=>{
                    filterEqual({
                      field_name:'estado',
                      field_value: e.target.value,
                      field_label: "Estado"
                    })
                  }}
                >
                  <option value="">Todos</option>
                  <option value="1">Habilidato</option>
                  <option value="0">Deshabilitado</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Tab>
          <Tab eventKey="between" title="Rango">
            <Form.Group as={Row} className="mb-3">
              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="f_entre">Campo</Form.Label>
                <Form.Select
                  id="f_entre"
                  name="field_name"
                  value={userFilterForm.between[0]?.field_name || ""}
                  onChange={handleFilterField}
                >
                  <option value="">Ninguno</option>
                  <option value="created_at">F. Creación</option>
                  <option value="updated_at">F. Actualización</option>
                </Form.Select>
              </Col>
              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="periodos">Periodos</Form.Label>
                <Form.Select
                  id="periodos"
                  name="periodos"
                  disabled={!Boolean(userFilterForm.between[0]?.field_name)}
                  value={userFilterForm.between[0]?.betweenName || ""}
                  onChange={(e) => {
                    filterPeriod(e.target.value as CommonPeriod["key"])                    
                  }}
                >
                  <option value="">Personalizado</option>
                  {commonPeriods.map(el=>(
                    <option key={el.key} value={el.key}>{el.text}</option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="1">
                Del
              </Form.Label>
              <Col sm="5">
                <Form.Control
                  disabled={!Boolean(userFilterForm.between[0]?.field_name) || Boolean(userFilterForm.between[0]?.betweenName)}
                  type="date"
                  name="from"
                  value={userFilterForm.between[0]?.from || ""}
                  onChange={handleFilterDate}
                />
              </Col>
              <Form.Label column sm="1">
                Al
              </Form.Label>
              <Col sm="5">
                <Form.Control
                  disabled={!Boolean(userFilterForm.between[0]?.field_name) || Boolean(userFilterForm.between[0]?.betweenName)}
                  type="date"
                  name="to"
                  value={userFilterForm.between[0]?.to || ""}
                  onChange={handleFilterDate}
                />
              </Col>
            </Form.Group>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

export default UsersLstFilter;
