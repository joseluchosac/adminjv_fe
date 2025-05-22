import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutationCatalogosQuery } from '../hooks/useCatalogosQuery';
// import { Distrito, Provincia, Ubigeo } from '../types';
import useCatalogosStore from '../store/useCatalogosStore';
import { Distrito, Provincia, Ubigeo } from '../types/catalogosTypes';

type Props = {
  show: boolean;
  setShow: (par:boolean)=>void;
  onChooseUbigeo: (ubigeo: Ubigeo) => void
}
const formInit = {ubigeo_inei:"", departamento:"", provincia:"", distrito:""}

function UbigeosMdl({show, setShow, onChooseUbigeo}: Props) {
  const [form, setForm] = useState(formInit)
  const departamentos = useCatalogosStore(state=>state.catalogos?.departamentos)
  const {
    data: dataProvincias,
    isPending: isPendingProvincias,
    getProvincias
  } = useMutationCatalogosQuery()
  const {
    data: dataDistritos,
    isPending: isPendingDistritos,
    getDistritos
  } = useMutationCatalogosQuery()

  const handleClose = () => setShow(false);

  const handleChooseUbigeo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!form.ubigeo_inei){
      console.log("seleccione todas las opciones")
      return
    }
    onChooseUbigeo(form)
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {id, value} = e.target
    switch (id) {
      case "departamento":{
        getProvincias({departamento: value})
        getDistritos({departamento: form.departamento, provincia: ""})
        setForm({departamento: value, provincia:"", distrito:"", ubigeo_inei:""})
        break
      }
      case "provincia":{
        getDistritos({departamento: form.departamento, provincia: value})
        setForm({...form, provincia: value, distrito:"", ubigeo_inei:""})
        break
      }
      case "distrito":{
        const ubigeo_inei = (dataDistritos as Distrito[]).find((el) => el.distrito === value)?.ubigeo_inei;
        setForm({...form, distrito:value, ubigeo_inei: ubigeo_inei ? ubigeo_inei : ""})
        break
      }
    }
  }

  useEffect(()=>{
    if(show){
      setForm(formInit)
    }
  },[show])

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="py-2">
        <Modal.Title>Ubigeos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleChooseUbigeo}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="departamento">Departamento</Form.Label>
            <Form.Select 
              id="departamento" 
              value={form.departamento}
              onChange={handleChange} 
            >
              <option value="">- Seleccione -</option>
              {departamentos?.map((el) => 
                <option key={el.departamento} value={el.departamento}>{el.departamento}</option>
              )}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="provincia">Provincia</Form.Label>
            <Form.Select 
              id="provincia" 
              value={form.provincia}
              onChange={handleChange}
            >
              <option value="">{isPendingProvincias ? "Espere...":"- Seleccione -"}</option>
              {dataProvincias?.map((el: Provincia) => 
                <option key={el.provincia} value={el.provincia}>{el.provincia}</option>
              )}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="distrito">Distrito</Form.Label>
            <Form.Select 
              id="distrito"
              value={form.distrito}
              onChange={handleChange}
            >
              <option value="">{isPendingDistritos ? "Espere...":"- Seleccione -"}</option>
              {dataDistritos?.map((el: Distrito) => 
                <option key={el.distrito} value={el.distrito}>{el.distrito}</option>
              )}
            </Form.Select>
          </Form.Group>
          <div className='d-flex justify-content-end gap-3'>
            <Button type='button' variant="secondary" onClick={handleClose}>
              Cerrar
            </Button>
            <Button type='submit' variant="primary">
              Aceptar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default UbigeosMdl;
