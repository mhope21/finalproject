import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { API_URL } from "../constants";

function Calendar() {
  const calendarRef = useRef(null);

  // Handle clicking a date to switch to the day view
  const handleDateClick = (info) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView("timeGridDay", info.dateStr); // Switch to day view
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
            textColor: "black",
            color: "white",
          }}
          dateClick={handleDateClick} // Trigger day view switch on date click
        />
      </section>
    </>
  );
}

export default Calendar;
