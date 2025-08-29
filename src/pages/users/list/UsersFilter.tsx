import { useMemo, useRef } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useUsers } from '../context/UsersContext';
import { CommonPeriod, EqualItem, Rol } from '../../../app/types';
import { useRolesQuery } from '../../../api/queries/useRolesQuery';
import { useCajasQuery } from '../../../api/queries/useCatalogosQuery';
import { commonPeriods } from '../../../app/utils/constants';
import { LdsBar } from '../../../app/components/Loaders';

type Props = {isFetching: boolean;}

export function UsersFilter({isFetching}: Props) {
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

  const handleFilterBetweenField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const field_name = e.currentTarget.value;
    const field_label = e.currentTarget.options[e.currentTarget.selectedIndex].textContent || ""
    dispatchUsers({
      type: 'SET_USER_FILTER_FORM_BETWEEN_FIELD',
      payload: { field_name, field_label }
    });
  };

  const filterBetweenPeriod = (periodKey: CommonPeriod["key"]) => {
    dispatchUsers({
      type: 'SET_USER_FILTER_FORM_BETWEEN_PERIOD',
      payload: { periodKey }
    });
  }

  const handleFilterBetweenDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    dispatchUsers({
      type: 'SET_USER_FILTER_FORM_BETWEEN_DATE',
      payload: { name, value }
    });
  };

  const handleOnHide = () => {
    dispatchUsers({
      type: "SET_SHOW_USER_FILTER",
      payload: false
    })
  }

  return (
    <Offcanvas show={showUsersFilter} placement='end' onHide={handleOnHide}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Filtros de usuarios</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {isFetching && <LdsBar />}
        <Card className="mb-4">
          <Card.Header>
            Orden
          </Card.Header>
          <Card.Body>
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
          </Card.Body>
        </Card>
        <Card className="mb-4">
          <Card.Header>Filtrar</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column xs="3" htmlFor="f_rol">Rol</Form.Label>
                <Col>
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
                    {(roles as Rol[])?.map((el) => (
                      <option key={el.id} value={el.rol}>
                        {el.rol}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column xs="3" htmlFor="f_caja">Caja</Form.Label>
                <Col>
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
                    {cajas.map((el) => (
                      <option key={el.id} value={el.descripcion}>
                        {el.descripcion}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column xs="3" htmlFor="f_estado">Estado</Form.Label>
                <Col>
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
                </Col>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
        <Card className="mb-4">
          <Card.Header>Rango</Card.Header>
          <Card.Body>
            <Form.Group as={Row} className="mb-3">
              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="f_entre">Campo</Form.Label>
                <Form.Select
                  id="f_entre"
                  name="field_name"
                  value={userFilterForm.between[0]?.field_name || ""}
                  onChange={handleFilterBetweenField}
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
                    filterBetweenPeriod(e.target.value as CommonPeriod["key"])                    
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
              <Col sm="6">
                <Form.Label htmlFor="from">
                  Del
                </Form.Label>
                <Form.Control
                  disabled={!Boolean(userFilterForm.between[0]?.field_name) || Boolean(userFilterForm.between[0]?.betweenName)}
                  type="date"
                  name="from"
                  id="from"
                  value={userFilterForm.between[0]?.from.split(" ")[0] || ""}
                  onChange={handleFilterBetweenDate}
                />
              </Col>
              <Col sm="6">
                <Form.Label htmlFor="to">
                  Al
                </Form.Label>
                <Form.Control
                  disabled={!Boolean(userFilterForm.between[0]?.field_name) || Boolean(userFilterForm.between[0]?.betweenName)}
                  type="date"
                  name="to"
                  id="to"
                  value={userFilterForm.between[0]?.to.split(" ")[0] || ""}
                  onChange={handleFilterBetweenDate}
                />
              </Col>
            </Form.Group>
          </Card.Body>
        </Card>
      </Offcanvas.Body>
    </Offcanvas>
  );
}