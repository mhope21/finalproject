import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import CalendarComponent from "./CalendarComponent";
import EventModal from "./EventModal";
import { API_URL } from "../constants";

const Calendar = () => {
  const calendarRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', start: '', end: '', color: '#3788d8' });

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false);

    try {
      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEvent.title,
          description: newEvent.description,
          start_time: newEvent.start,
          end_time: newEvent.end,
          color: newEvent.color,
        }),
      });
      if (!response.ok) throw new Error("Failed to save event");

      const savedEvent = await response.json();
      console.log("Event saved successfully", savedEvent);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  return (
    <>
    <div className="black-strip"></div>
    <section className="page-section" id="register">
      <CalendarComponent newEvent={newEvent}
        setNewEvent={setNewEvent}
        setShowModal={setShowModal} /> 
      <EventModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleSubmit={handleSubmit}
        newEvent={newEvent}
        handleInputChange={handleInputChange}
      />
      </section>
    </>
  );
};

export default Calendar;


