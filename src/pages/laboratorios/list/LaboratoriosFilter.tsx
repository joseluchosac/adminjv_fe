import { useRef } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { CommonPeriod} from '../../../app/types';
import { commonPeriods } from '../../../app/utils/constants';
import { LdsBar } from '../../../app/components/Loaders';
import useLaboratoriosStore from '../../../app/store/useLaboratoriosStore';

type Props = {isFetching: boolean;}

export function LaboratoriosFilter({isFetching}: Props) {
  const laboratorioFilterForm = useLaboratoriosStore(state => state.laboratorioFilterForm)
  const showLaboratoriosFilter = useLaboratoriosStore(state => state.showLaboratoriosFilter)
  const camposLaboratorio = useLaboratoriosStore(state => state.camposLaboratorio)
  const setLaboratorioFilterFormSort = useLaboratoriosStore(state => state.setLaboratorioFilterFormSort)
  const setLaboratorioFilterFormBetweenField = useLaboratoriosStore(state => state.setLaboratorioFilterFormBetweenField)
  const setLaboratorioFilterFormBetweenPeriod = useLaboratoriosStore(state => state.setLaboratorioFilterFormBetweenPeriod)
  const setLaboratorioFilterFormBetweenDate = useLaboratoriosStore(state => state.setLaboratorioFilterFormBetweenDate)
  const setShowLaboratorioFilter = useLaboratoriosStore(state => state.setShowLaboratorioFilter)
  const orderRef = useRef<HTMLSelectElement | null>(null)
  const orderDirRef = useRef<HTMLSelectElement | null>(null)
  


  const sort = () => {
    const field_name = orderRef.current?.value || ""
    const field_label = orderRef.current?.options[orderRef.current?.selectedIndex].textContent || ""
    const order_dir = orderDirRef.current?.value as "ASC" | "DESC"
    setLaboratorioFilterFormSort({field_name, field_label, order_dir})
  }


  const handleFilterBetweenField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const field_name = e.currentTarget.value;
    const field_label = e.currentTarget.options[e.currentTarget.selectedIndex].textContent || ""
    setLaboratorioFilterFormBetweenField({ field_name, field_label })
  };

  const filterBetweenPeriod = (periodKey: CommonPeriod["key"]) => {
    setLaboratorioFilterFormBetweenPeriod({ periodKey })
  }

  const handleFilterBetweenDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setLaboratorioFilterFormBetweenDate({ name, value })
  };

  const handleOnHide = () => {
    setShowLaboratorioFilter(false)
  }

  return (
    <Offcanvas show={showLaboratoriosFilter} placement='end' onHide={handleOnHide}>
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
                  value={laboratorioFilterForm.order.length ? laboratorioFilterForm.order[0].field_name : ""}
                  onChange={()=> sort()}
                >
                  <option value="">Ninguno</option>
                  {camposLaboratorio && camposLaboratorio.filter(el=>el.orderable).map(el=>{
                    return <option key={el.field_name} value={el.field_name}>{el.field_label}</option>
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} sm={4} className="mb-3">
                <Form.Label htmlFor="f_order_dir">Dir</Form.Label>
                <Form.Select
                  ref={orderDirRef}
                  disabled={!Boolean(laboratorioFilterForm.order.length)}
                  id="f_order_dir"
                  name="order_dir"
                  value={laboratorioFilterForm.order.length ? laboratorioFilterForm.order[0].order_dir : "ASC"}
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
          <Card.Header>Rango</Card.Header>
          <Card.Body>
            <Form.Group as={Row} className="mb-3">
              <Col sm={6} className="mb-3">
                <Form.Label htmlFor="f_entre">Campo</Form.Label>
                <Form.Select
                  id="f_entre"
                  name="field_name"
                  value={laboratorioFilterForm.between[0]?.field_name || ""}
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
                  disabled={!Boolean(laboratorioFilterForm.between[0]?.field_name)}
                  value={laboratorioFilterForm.between[0]?.betweenName || ""}
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
                  disabled={!Boolean(laboratorioFilterForm.between[0]?.field_name) || Boolean(laboratorioFilterForm.between[0]?.betweenName)}
                  type="date"
                  name="from"
                  id="from"
                  value={laboratorioFilterForm.between[0]?.from.split(" ")[0] || ""}
                  onChange={handleFilterBetweenDate}
                />
              </Col>
              <Col sm="6">
                <Form.Label htmlFor="to">
                  Al
                </Form.Label>
                <Form.Control
                  disabled={!Boolean(laboratorioFilterForm.between[0]?.field_name) || Boolean(laboratorioFilterForm.between[0]?.betweenName)}
                  type="date"
                  name="to"
                  id="to"
                  value={laboratorioFilterForm.between[0]?.to.split(" ")[0] || ""}
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