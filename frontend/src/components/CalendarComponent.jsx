import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { API_URL } from "../constants";

const CalendarComponent = ({ setNewEvent, setShowModal, newEvent }) => {
  const calendarRef = useRef(null);

  const handleDateClick = (info) => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView("timeGridDay", info.dateStr); // Switch to day view
  };

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

  return (
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
        method: "GET",
        extraParams: { customParam: "value" },
        failure: () => console.error("Failed to fetch events from backend"),
      }}
      eventDidMount={({ event, el }) => {
        if (event.extendedProps.color) {
          el.style.backgroundColor = event.extendedProps.color;
        }
        el.title = event.extendedProps.description || "No description available";
      }}
      selectable={true}
      dateClick={handleDateClick}
      select={handleDateSelect}
    />
  );
};

export default CalendarComponent;
