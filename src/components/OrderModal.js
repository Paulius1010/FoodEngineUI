import { Modal, Button } from "react-bootstrap";

const OrderModal = ({ showModal, hideModal, confirmModal, id }) => {
  return (
    <Modal
      show={showModal}
      onHide={hideModal}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Užsakymo patvirtinimas</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="alert alert-danger">Ar tikrai norite užsakyti patiekalą?</div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="default" onClick={hideModal}>
          Atšaukti
        </Button>
        <Button variant="primary" onClick={() => confirmModal(id)}>
          Užsakyti
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderModal;