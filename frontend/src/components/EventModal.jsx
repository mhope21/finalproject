import React from "react";
import { Modal } from "react-bootstrap";
import EventForm from "./EventForm";

const EventModal = ({ showModal, setShowModal, handleSubmit, newEvent, handleInputChange }) => (
  <Modal show={showModal} onHide={() => setShowModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Create New Event</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <EventForm
        handleSubmit={handleSubmit}
        newEvent={newEvent}
        handleInputChange={handleInputChange}
      />
    </Modal.Body>
  </Modal>
);

export default EventModal;
