import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Trash2 } from "lucide-react";

const ConfirmDeleteModal = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <Modal
      show={isOpen}
      onHide={onCancel}
      centered
      backdrop="static"
      className="fade"
    >
      <Modal.Header
        closeButton
        className="border-0 text-white"
        style={{
          background: "linear-gradient(90deg, #dc3545, #ff4d4d)",
        }}
      >
        <Modal.Title className="fw-semibold d-flex align-items-center">
          <Trash2 className="me-2" size={20} /> Confirm Deletion
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center py-4">
        <p className="text-muted mb-3">
          Are you sure you want to permanently delete ?
        </p>
        <p className="fw-semibold text-danger mb-0">
          This action cannot be undone.
        </p>
      </Modal.Body>

      <Modal.Footer className="border-0 d-flex justify-content-center">
        <Button
          variant="outline-secondary"
          className="rounded-pill px-4"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className="rounded-pill px-4"
          onClick={onConfirm}
        >
          <Trash2 size={16} className="me-2" />
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
