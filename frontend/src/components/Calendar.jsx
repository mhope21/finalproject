import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Button, Form } from 'react-bootstrap';
import { API_URL } from "../constants";

function Calendar() {
  const calendarRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', start: '', end: '', color: '#3788d8' });

  // Handle clicking a date to switch to the day view
  const handleDateClick = (info) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView("timeGridDay", info.dateStr); // Switch to day view
  };

  // Handle selecting a time range to open the modal
  const handleDateSelect = (selectInfo) => {
    const calendarApi = calendarRef.current.getApi();
  
    // Check if the current view is "timeGridDay"
    if (calendarApi.view.type === "timeGridDay" || calendarApi.view.type === "timeGridWeek") {
      setNewEvent({
        ...newEvent,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      });
      setShowModal(true);
    } else {
      // For other views like dayGridMonth, do nothing or switch views
      calendarApi.changeView("timeGridDay", selectInfo.startStr);
    }
  };

  // Handle input changes in the modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  // Submit event data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false);

    // Save event to the backend
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newEvent.title,
          description: newEvent.description,
          start_time: newEvent.start,
          end_time: newEvent.end,
          color: newEvent.color
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save event");
      }
      const savedEvent = await response.json();

      // Add event to the calendar dynamically with color
      const calendarApi = calendarRef.current.getApi();
      calendarApi.addEvent({
        title: savedEvent.title,
        description: savedEvent.description,
        start: savedEvent.start_time,
        end: savedEvent.end_time,
        color: newEvent.color,
      });
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <>
      <div className="black-strip"></div>
      <section className="page-section" id="services">
      <FullCalendar
  ref={calendarRef}
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  headerToolbar={{
    left: "prev,next,today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  }}
  events={{
    url: `${API_URL}/events`,
    method: 'GET',
    extraParams: {
      customParam: 'value'
    },
    failure: function() {
      console.error("Failed to fetch events from backend");
    }
  }}
  eventDidMount={function(info) {
    const { event, el } = info;

    // Set the background color using eventColor
    if (event.extendedProps.color) {
      el.style.backgroundColor = event.extendedProps.color;
    }

    // Optionally, if you want to use a tooltip, use fullCalendar's built-in tooltip functionality
    el.title = event.extendedProps.description || 'No description available';
  
  }}
  selectable={true}
  dateClick={handleDateClick}
  select={handleDateSelect} // Open modal on time range selection
/>



        {/* Modal for creating new event */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                <Form.Control
                  type="text"
                  name="start"
                  value={newEvent.start}
                  readOnly
                />
              </Form.Group>
              <Form.Group controlId="formEnd">
                <Form.Label>End Time</Form.Label>
                <Form.Control
                  type="text"
                  name="end"
                  value={newEvent.end}
                  readOnly
                />
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
          </Modal.Body>
        </Modal>
      </section>
    </>
  );
}

export default Calendar;

