import { Modal, Button } from "react-bootstrap";

const OrderDecreaseModal = ({ showModal, hideModal, confirmModal, id }) => {
  return (
    <Modal
      show={showModal}
      onHide={hideModal}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Užsakymo mažinimo patvirtinimas</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="alert alert-danger">Ar tikrai norite sumažinti užsakymų skaičių</div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="default" onClick={hideModal}>
          Atšaukti
        </Button>
        <Button variant="danger" onClick={() => confirmModal(id)}>
          Sumažinti
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDecreaseModal;