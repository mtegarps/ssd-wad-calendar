import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import './calendar.css';

const Calendar = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const handleDayClick = (day) => {
    const existingEvents = events.filter((event) => event.day === day);
    if (existingEvents.length >= 3) {
      alert('You can only add up to 3 events per day.');
      return;
    }
    setSelectedDay(day);
    setShowModal(true);
  };

  const handleAddEvent = () => {
    const eventTitle = document.getElementById('eventTitle').value;
    const eventTime = document.getElementById('eventTime').value;
    const eventInvitees = document.getElementById('eventInvitees').value;

    const colors = ['bg-primary', 'bg-success', 'bg-info'];
    const usedColors = events.filter((event) => event.day === selectedDay).map((event) => event.color);
    const availableColors = colors.filter((color) => !usedColors.includes(color));
    const color =
      availableColors.length > 0 ? availableColors[0] : colors[Math.floor(Math.random() * colors.length)];

    const newEvent = {
      day: selectedDay,
      title: eventTitle,
      time: eventTime,
      invitees: eventInvitees.split(',').map((invitee) => invitee.trim()),
      color,
    };

    setEvents([...events, newEvent]);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditEvent = (event) => {
    const updatedTitle = prompt('Enter updated event title:', event.title);
    if (updatedTitle) {
      const updatedTime = prompt('Enter updated event time (12-hour format):', event.time);
      const updatedInvitees = prompt(
        'Enter updated event invitees (comma-separated email addresses):',
        event.invitees.join(', ')
      );

      const updatedEvent = {
        ...event,
        title: updatedTitle,
        time: updatedTime,
        invitees: updatedInvitees.split(',').map((invitee) => invitee.trim()),
      };

      const updatedEvents = events.map((ev) => (ev.day === event.day ? updatedEvent : ev));
      setEvents(updatedEvents);
    }
  };

  const handleDeleteEvent = (event) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this event?');
    if (confirmDelete) {
      const updatedEvents = events.filter((ev) => ev !== event);
      setEvents(updatedEvents);
    }
  };

  return (
    <div className="container text-center mt-4 mb-4">
      <h1>Calendar</h1>
      <h2>
        {monthNames[currentMonth]} {currentYear}
      </h2>
      <table className="table">
        <thead>
          <tr>
            {daysOfWeek.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(Math.ceil((daysInMonth + firstDayOfWeek) / 7))
            .fill()
            .map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array(7)
                  .fill()
                  .map((_, colIndex) => {
                    const day = rowIndex * 7 + colIndex - firstDayOfWeek + 1;
                    if (day < 1 || day > daysInMonth) {
                      return <td key={colIndex}></td>;
                    }
                    const dayEvents = events.filter((event) => event.day === day);
                    const colorClasses = dayEvents.map((event) => event.color);

                    return (
                      <td key={colIndex} onClick={() => handleDayClick(day)}>
                        <div className={`day ${colorClasses.join(' ')}`}>
                          {day}
                        </div>
                        <div className="events">
                          {dayEvents.map((event, index) => (
                            <div className={`event ${event.color}`} key={index}>
                              <div className="event-title">{event.title}</div>
                              <div className="event-details">
                                <div>Time: {event.time}</div>
                                <div>Invitees: {event.invitees.join(', ')}</div>
                              </div>
                              <div className="event-actions">
                                <button className="btn btn-sm btn-primary" onClick={() => handleEditEvent(event)}>
                                  Edit
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteEvent(event)}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                          {dayEvents.length < 3 && (
                            <div className="add-event" onClick={() => handleDayClick(day)}>
                              + Add Event
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
              </tr>
            ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Title</label>
            <input type="text" id="eventTitle" className="form-control" />
          </div>
          <div className="form-group">
            <label>Time (12-hour format)</label>
            <input type="text" id="eventTime" className="form-control" />
          </div>
          <div className="form-group">
            <label>Invitees (comma-separated email addresses)</label>
            <input type="text" id="eventInvitees" className="form-control" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddEvent}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Calendar;
