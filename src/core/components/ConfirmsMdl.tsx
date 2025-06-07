import { useEffect, useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useMutationUsersQuery } from '../hooks/useUsersQuery';
import { LdsBar } from './Loaders';
import { toast } from 'react-toastify';

type ConfirmPassProps = {
  show: boolean;
  setShow: (par:boolean) => void;
  onSuccess: () => void
}

function ConfirmPass({show, setShow, onSuccess}: ConfirmPassProps) {
  const [password, setPassword] = useState("")
  const {data, isPending, isError, checkPassword} = useMutationUsersQuery()



  const handleClose = () => setShow(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    checkPassword(password)
    // onSuccess()
  }

  useEffect(() => {
    setPassword("")
  },[show])

  useEffect(() => {
    if(!data) return
    if(data.error){
      toast(data?.msg, {type: data?.msgType})
    }else{
      onSuccess()
      setShow(false)
    }
  },[data])
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <h5>Ingrese su contraseña para confirmar</h5>
      </Modal.Header>
      <Modal.Body>
        {isPending && <LdsBar />}
        {isError && <Alert variant="danger" className='py-1 px-3'>
          Hubo un error
        </Alert>}
       
        <Form  onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control
              id="password"
              type="password"
              value={password}
              onChange={handleChange}
              autoFocus
            />
          </Form.Group>
          <div className='d-flex justify-content-end gap-3'>
            <Button type='button' variant="secondary" onClick={handleClose}>
              Cancelar
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

export {ConfirmPass};
