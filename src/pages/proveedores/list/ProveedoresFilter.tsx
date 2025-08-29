import { useMemo, useRef } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { CommonPeriod, EqualItem } from '../../../app/types';
import { useTiposDocumentoQuery } from '../../../api/queries/useCatalogosQuery';
import { commonPeriods } from '../../../app/utils/constants';
import { LdsBar } from '../../../app/components/Loaders';
import useProveedoresStore from '../../../app/store/useProveedoresStore';

type Props = {isFetching: boolean;}

export function ProveedoresFilter({isFetching}: Props) {
  const proveedorFilterForm = useProveedoresStore(state => state.proveedorFilterForm)
  const showProveedoresFilter = useProveedoresStore(state => state.showProveedoresFilter)
  const camposProveedor = useProveedoresStore(state => state.camposProveedor)
  const setProveedorFilterFormSort = useProveedoresStore(state => state.setProveedorFilterFormSort)
  const setProveedorFilterFormEqual = useProveedoresStore(state => state.setProveedorFilterFormEqual)
  const setProveedorFilterFormBetweenField = useProveedoresStore(state => state.setProveedorFilterFormBetweenField)
  const setProveedorFilterFormBetweenPeriod = useProveedoresStore(state => state.setProveedorFilterFormBetweenPeriod)
  const setProveedorFilterFormBetweenDate = useProveedoresStore(state => state.setProveedorFilterFormBetweenDate)
  const setShowProveedorFilter = useProveedoresStore(state => state.setShowProveedorFilter)
  const {tiposDocumento} = useTiposDocumentoQuery()
  const orderRef = useRef<HTMLSelectElement | null>(null)
  const orderDirRef = useRef<HTMLSelectElement | null>(null)
  


  const sort = () => {
    const field_name = orderRef.current?.value || ""
    const field_label = orderRef.current?.options[orderRef.current?.selectedIndex].textContent || ""
    const order_dir = orderDirRef.current?.value as "ASC" | "DESC"
    setProveedorFilterFormSort({field_name, field_label, order_dir})
  }

  const equals = useMemo(() => {
    const equalsInit = {
      tipo_documento: proveedorFilterForm.equal.find(el => el.field_name === "tipo_documento")?.field_value || "",
    }
    return equalsInit
  }, [proveedorFilterForm.equal]);

  const filterEqual = ({field_name, field_value, field_label}: EqualItem) => {
    setProveedorFilterFormEqual({ field_name, field_value, field_label })
  }

  const handleFilterBetweenField = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const field_name = e.currentTarget.value;
    const field_label = e.currentTarget.options[e.currentTarget.selectedIndex].textContent || ""
    setProveedorFilterFormBetweenField({ field_name, field_label })
  };

  const filterBetweenPeriod = (periodKey: CommonPeriod["key"]) => {
    setProveedorFilterFormBetweenPeriod({ periodKey })
  }

  const handleFilterBetweenDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setProveedorFilterFormBetweenDate({ name, value })
  };

  const handleOnHide = () => {
    setShowProveedorFilter(false)
  }

  return (
    <Offcanvas show={showProveedoresFilter} placement='end' onHide={handleOnHide}>
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
                  value={proveedorFilterForm.order.length ? proveedorFilterForm.order[0].field_name : ""}
                  onChange={()=> sort()}
                >
                  <option value="">Ninguno</option>
                  {camposProveedor && camposProveedor.filter(el=>el.orderable).map(el=>{
                    return <option key={el.field_name} value={el.field_name}>{el.field_label}</option>
                  })}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} sm={4} className="mb-3">
                <Form.Label htmlFor="f_order_dir">Dir</Form.Label>
                <Form.Select
                  ref={orderDirRef}
                  disabled={!Boolean(proveedorFilterForm.order.length)}
                  id="f_order_dir"
                  name="order_dir"
                  value={proveedorFilterForm.order.length ? proveedorFilterForm.order[0].order_dir : "ASC"}
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
                <Form.Label column xs="4" htmlFor="f_tipo_documento">Tipo Doc.</Form.Label>
                <Col>
                  <Form.Select
                    id="f_tipo_documento"
                    value={equals.tipo_documento as string}
                    onChange={(e)=>{
                      filterEqual({
                        field_name:'tipo_documento',
                        field_value: e.target.value,
                        field_label: "T Documento"
                      })
                    }}
                  >
                    <option value="">Todos</option>
                    {tiposDocumento.map((el) => (
                      <option key={el.id} value={el.descripcion}>
                        {el.descripcion}
                      </option>
                    ))}
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
                  value={proveedorFilterForm.between[0]?.field_name || ""}
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
                  disabled={!Boolean(proveedorFilterForm.between[0]?.field_name)}
                  value={proveedorFilterForm.between[0]?.betweenName || ""}
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
                  disabled={!Boolean(proveedorFilterForm.between[0]?.field_name) || Boolean(proveedorFilterForm.between[0]?.betweenName)}
                  type="date"
                  name="from"
                  id="from"
                  value={proveedorFilterForm.between[0]?.from.split(" ")[0] || ""}
                  onChange={handleFilterBetweenDate}
                />
              </Col>
              <Col sm="6">
                <Form.Label htmlFor="to">
                  Al
                </Form.Label>
                <Form.Control
                  disabled={!Boolean(proveedorFilterForm.between[0]?.field_name) || Boolean(proveedorFilterForm.between[0]?.betweenName)}
                  type="date"
                  name="to"
                  id="to"
                  value={proveedorFilterForm.between[0]?.to.split(" ")[0] || ""}
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