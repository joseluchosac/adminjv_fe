import Modal from "react-bootstrap/Modal";
import { Button, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { useUsers } from "../context/UsersContext";
import { CampoTable, EqualItem, OrderItem } from "../../../core/types";
import { LdsBar } from "../../../core/components/Loaders";
import { useCajasQuery } from "../../../core/hooks/useCatalogosQuery";
import { useRolesQuery } from "../../../core/hooks/useRolesQuery";
import { toast } from "react-toastify";

const betweenFormInit = {
  range: { field_name: "", field_label: "", from: "", to: "" },
  rangeName: ""
};
type Props = {
  isFetching: boolean;
  camposUser: CampoTable[]
}
const UsersLstFilter: React.FC<Props> = ({isFetching, camposUser}) => {
  const [tabName, setTabName] = useState("order")
  const [betweenForm, setBetweenForm] = useState(betweenFormInit);
  const {roles} = useRolesQuery()
  const {cajas} = useCajasQuery()
  const {
    stateUsers: { filterParamUsersForm, showUsersFilterMdl },
    dispatchUsers
  } = useUsers()

  const handleChangeOrder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const field_name = e.target.value
    const field_label = e.currentTarget.options[e.currentTarget.selectedIndex].textContent || ""
    const newOrders: OrderItem[] = field_name ? [{field_name, order_dir: "ASC", field_label}] : []
    dispatchUsers({
      type: 'SET_FILTER_PARAMS_USERS_FORM',
      payload: {...filterParamUsersForm, order: newOrders}
    });
  }

  const handleChangeOrderDir = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const order_dir = e.target.value as "ASC" | "DESC"
    const newOrders: OrderItem[] = [{...filterParamUsersForm.order[0], order_dir}]
    dispatchUsers({
      type: 'SET_FILTER_PARAMS_USERS_FORM',
      payload: {...filterParamUsersForm, order: newOrders}
    });
  }

  const equals = useMemo(() => {
    const equalsInit = {
      rol: filterParamUsersForm.equal.find(el => el.field_name === "rol")?.field_value || "",
      caja: filterParamUsersForm.equal.find(el => el.field_name === "caja")?.field_value || "",
      estado: filterParamUsersForm.equal.find(el => el.field_name === "estado")?.field_value || ""
    }
    return equalsInit
  }, [filterParamUsersForm.equal]);

  const filterEqual = ({field_name, field_value, field_label}: EqualItem) => {
    let equalClone = structuredClone(filterParamUsersForm.equal);
    if(!field_value){
      equalClone = equalClone.filter(el => el.field_name !== field_name)
    }else{
      const idx = equalClone.findIndex(el => el.field_name === field_name)
      if(idx === -1){
        equalClone = [ ...equalClone, {field_name, field_value, field_label} ]
      }else{
        equalClone[idx] = {field_name, field_value, field_label}
      }
    }
    dispatchUsers({
      type: 'SET_FILTER_PARAMS_USERS_FORM',
      payload: { ...filterParamUsersForm, equal: equalClone }
    });
  }

  const handleSelectCampoRange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const field_name = e.currentTarget.value;
    const field_label = e.currentTarget.options[e.currentTarget.selectedIndex].textContent || ""
    if (!field_name) {
      setBetweenForm(betweenFormInit);
    } else {
      setBetweenForm({...betweenForm, range: { ...betweenForm.range, field_name, field_label } });
    }
  };

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    if (name === "from") {
      setBetweenForm({ ...betweenForm, range: { ...betweenForm.range, [name]: value, to: value } });
    } else if (name === "to") {
      if (value === "") {
        setBetweenForm({ ...betweenForm, range: { ...betweenForm.range, [name]: betweenForm.range.from} });
      } else {
        setBetweenForm({ ...betweenForm, range: { ...betweenForm.range, [name]: value } });
      }
    }
  };

  const rangePred = (rangeName: string) => {
    let startDate = new Date();
    let endDate = new Date();
    if (rangeName === "today") {
      // No agregar nada
    } else if (rangeName === "thisWeek") {
      startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
      endDate = endOfWeek(new Date(), { weekStartsOn: 0 });
    } else if (rangeName === "thisMonth") {
      startDate = startOfMonth(new Date());
      endDate = endOfMonth(new Date());
    } else if (rangeName === "thisYear") {
      startDate = new Date(new Date().getFullYear(), 0, 1);
      endDate = new Date(new Date().getFullYear(), 11, 31);
    } else if (rangeName === "lastWeek") {
      startDate = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 0 });
      endDate = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 0 });
    }  else if (rangeName === "lastMonth") {
      startDate = startOfMonth(subMonths(new Date(), 1));
      endDate = endOfMonth(subMonths(new Date(), 1));
    } else if (rangeName === "lastYear") {
      startDate = new Date(new Date().getFullYear() - 1, 0, 1);
      endDate = new Date(new Date().getFullYear() - 1, 11, 31);
    } else {
      setBetweenForm({...betweenForm, range: {...betweenForm.range, from:'', to:''}})
      return
    }
    const startFormatDate = format(startDate, "yyyy-MM-dd");
    const endFormatDate = format(endDate, "yyyy-MM-dd");
    setBetweenForm({
      ...betweenForm,
      range: {...betweenForm.range, from:startFormatDate, to:endFormatDate}
    })
  }

  const handleFilterBetween = () => {
    const {range} = betweenForm
    if(!range.field_name) return toast.warning("Elija el campo a filtrar")
    if(!range.from) return toast.warning("Ingrese el rango inicial")
    if(!range.to) return toast.warning("Ingrese el rango final")
    const newBetween = {
      field_name: range.field_name,
      field_label: range.field_label,
      from: range.from ? range.from + " 00:00:00" : "",
      to: range.to ? range.to + " 23:59:59" : "",
    };
    dispatchUsers({
      type: 'SET_FILTER_PARAMS_USERS_FORM',
      payload: {
        ...filterParamUsersForm,
        between: [newBetween],
      },
    });
  };

  const handleUnbetween = () => {
    setBetweenForm(betweenFormInit)
    if(!filterParamUsersForm.between.length) return
    dispatchUsers({
      type: 'SET_FILTER_PARAMS_USERS_FORM',
      payload: {
        ...filterParamUsersForm,
        between: [],
      },
    });
  }

 useEffect(() => {
  rangePred(betweenForm.rangeName)
 }, [betweenForm.rangeName])

 useEffect(() => {
  if(!filterParamUsersForm.between.length){
    handleUnbetween()
  }
 }, [filterParamUsersForm.between])

  return (
    <Modal 
      show={showUsersFilterMdl} 
      onHide={()=>
        dispatchUsers({
          type: 'SET_SHOW_USERS_FILTER_MDL',
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
                  id="f_order"
                  name="order"
                  value={filterParamUsersForm.order.length ? filterParamUsersForm.order[0].field_name : ""}
                  onChange={handleChangeOrder}
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
                  id="f_order_dir"
                  name="order_dir"
                  value={filterParamUsersForm.order.length ? filterParamUsersForm.order[0].order_dir : "ASC"}
                  onChange={handleChangeOrderDir}
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
                  value={betweenForm.range.field_name}
                  onChange={handleSelectCampoRange}
                >
                  <option value="">Ninguno</option>
                  <option value="created_at">Fecha de creación</option>
                  <option value="updated_at">Fecha de actualización</option>
                </Form.Select>
              </Col>
              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="periodos">Periodos</Form.Label>
                <Form.Select
                  id="periodos"
                  name="periodos"
                  value={betweenForm.rangeName}
                  onChange={(e) => {
                    setBetweenForm({...betweenForm, rangeName: e.currentTarget.value})
                  }}
                >
                  <option value="">Personalizado</option>
                  <option value="today">Hoy</option>
                  <option value="thisWeek">Semana actual</option>
                  <option value="lastWeek">Semana pasada</option>
                  <option value="thisMonth">Mes actual</option>
                  <option value="lastMonth">Mes pasado</option>
                  <option value="thisYear">Año actual</option>
                  <option value="lastYear">Año pasado</option>
                </Form.Select>
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm="1">
                Del
              </Form.Label>
              <Col sm="5">
                <Form.Control
                  disabled={Boolean(betweenForm.rangeName)}
                  type="date"
                  name="from"
                  value={betweenForm.range.from}
                  onChange={handleChangeDate}
                />
              </Col>
              <Form.Label column sm="1">
                Al
              </Form.Label>
              <Col sm="5">
                <Form.Control
                  disabled={Boolean(betweenForm.rangeName)}
                  type="date"
                  name="to"
                  value={betweenForm.range.to}
                  onChange={handleChangeDate}
                />
              </Col>
            </Form.Group>
            <Form.Group className="mt-4">
              <Col className="text-end">
                <Button onClick={handleUnbetween} variant="secondary" className="mx-3">Eliminar rango</Button>
                <Button onClick={handleFilterBetween}>Filtrar</Button>
              </Col>
            </Form.Group>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

export default UsersLstFilter;
