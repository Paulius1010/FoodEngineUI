import { Modal, Button } from "react-bootstrap";

const DeleteModal = ({ showModal, hideModal, confirmModal, id }) => {
  return (
    <Modal
      show={showModal}
      onHide={hideModal}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Trynimo patvirtinimas</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="alert alert-danger">Ar tikrai norite pašalinti šį įrašą?</div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="default" onClick={hideModal}>
          Atšaukti
        </Button>
        <Button variant="danger" onClick={() => confirmModal(id)}>
          Trinti
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;