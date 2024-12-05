import React from "react";
import { Form, Button } from "react-bootstrap";

const EventForm = ({ handleSubmit, newEvent, handleInputChange }) => (
  <Form onSubmit={handleSubmit}>
    <Form.Group controlId="formTitle">
      <Form.Label>Title</Form.Label>
      <Form.Control
        type="text"
        name="title"
        value={newEvent.title}
        onChange={handleInputChange}
        required
      />
    </Form.Group>
    <Form.Group controlId="formDescription">
      <Form.Label>Description</Form.Label>
      <Form.Control
        type="text"
        name="description"
        value={newEvent.description}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Form.Group controlId="formStart">
      <Form.Label>Start Time</Form.Label>
      <Form.Control type="text" name="start" value={newEvent.start} readOnly />
    </Form.Group>
    <Form.Group controlId="formEnd">
      <Form.Label>End Time</Form.Label>
      <Form.Control type="text" name="end" value={newEvent.end} readOnly />
    </Form.Group>
    <Form.Group controlId="formColor">
      <Form.Label>Event Color</Form.Label>
      <Form.Control
        type="color"
        name="color"
        value={newEvent.color}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Button variant="primary" type="submit">
      Save Event
    </Button>
  </Form>
);

export default EventForm;
