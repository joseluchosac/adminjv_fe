import { Col, Modal, ModalProps, Row } from "react-bootstrap"
import { BsPrefixRefForwardingComponent } from "react-bootstrap/esm/helpers"
import DynaIcon, { iconsMap } from "./DynaComponents"

const IconsModal: BsPrefixRefForwardingComponent<"div", ModalProps> = ({show, setShow, onChooseIcon}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const {name_icon} = e.currentTarget.dataset
    onChooseIcon(name_icon)
  }
  const handleClose = () => setShow(false);

  return (
    <Modal
    show={show}
    onHide={handleClose}
    backdrop={true}
    keyboard={false}
    size="sm"
  >
    <Modal.Header closeButton >
      <Modal.Title>Iconos</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Row className="justify-content-center">
          {Object.keys(iconsMap).map((el: string, idx) => 
            <Col 
              key={idx} 
              onClick={handleClick}
              data-name_icon={el}
              className="py-2 col-2 text-center boton-icon"
              role="button"
            >
              <DynaIcon name={el} />
            </Col>
          )}
        </Row>
    </Modal.Body>
  </Modal>
  )
}

export default IconsModal