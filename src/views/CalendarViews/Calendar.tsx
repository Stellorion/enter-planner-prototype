'use client';

import { EventClickArg, EventChangeArg } from '@fullcalendar/core';
import { Event } from '@/src/types/event';
import { useCalendarStore } from '@/src/store/useCalendarStore';
import CalendarComponent from '@/src/components/calendar/CalendarComponent';
import AddEventModal from '@/src/components/calendar/AddEventModal';
import UpdateModal from '@/src/components/calendar/UpdateModal';

export default function Calendar() {
  const {
    allEvents,
    showModal,
    showUpdateModal,
    selectedEvent,
    newEvent,
    setNewEvent,
    addEvent,
    deleteEvent,
    setShowModal,
    setShowUpdateModal,
    setSelectedEvent,
    resetNewEvent,
    updateEvent,
  } = useCalendarStore();

  function handleDateClick(arg: { date: Date; allDay: boolean }) {
    setNewEvent({
      ...newEvent,
      start: arg.allDay
        ? arg.date.toISOString().split('T')[0]
        : arg.date.toISOString().slice(0, 16),
      allDay: arg.allDay,
      id: new Date().getTime().toString(),
    });
    setShowModal(true);
  }

  function handleUpdateModal(clickInfo: EventClickArg) {
    const event: Event = {
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr || undefined,
      allDay: clickInfo.event.allDay,
      notes: clickInfo.event.extendedProps?.notes || ''
    };
    setSelectedEvent(event);
    setShowUpdateModal(true);
  }

  function handleUpdate(updatedEvent: Event) {
    updateEvent(updatedEvent);
    setShowUpdateModal(false);
    setSelectedEvent(null);
  }

  function handleUpdateChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (!selectedEvent) return;
    const { name, value, type } = event.target;
    const isCheckbox = type === 'checkbox';
    const newValue = isCheckbox
      ? (event.target as HTMLInputElement).checked
      : value;
    setSelectedEvent({ ...selectedEvent, [name]: newValue });
  }

  function handleDelete() {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      setShowUpdateModal(false);
      setSelectedEvent(null);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
    setShowUpdateModal(false);
    setSelectedEvent(null);
    resetNewEvent();
  }

  function handleEventChange(changeInfo: EventChangeArg) {
    const updatedEvent: Event = {
      id: changeInfo.event.id,
      title: changeInfo.event.title,
      start: changeInfo.event.startStr,
      end: changeInfo.event.endStr || undefined,
      allDay: changeInfo.event.allDay,
      notes: changeInfo.event.extendedProps?.notes || ''
    };
    updateEvent(updatedEvent);
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = event.target;
    const isCheckbox = type === 'checkbox';
    const newValue = isCheckbox
      ? (event.target as HTMLInputElement).checked
      : value;

    if (name === 'allDay') {
      const newStart = newEvent.start;
      const newEnd = newEvent.end;

      setNewEvent({
        ...newEvent,
        allDay: newValue as boolean,
        start: newValue
          ? newStart.split('T')[0]
          : `${newStart.split('T')[0]}T${new Date().getHours().toString().padStart(2, '0')}:00`,
        end: newEnd
          ? newValue
            ? newEnd.split('T')[0]
            : `${newEnd.split('T')[0]}T${(new Date().getHours() + 1).toString().padStart(2, '0')}:00`
          : undefined,
      });
    } else {
      setNewEvent({ ...newEvent, [name]: newValue });
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    addEvent(newEvent);
    setShowModal(false);
    resetNewEvent();
  }

  return (
    <div className="flex h-screen flex-col pt-16">
      <main className="flex-1 overflow-hidden p-4">
        <div className="flex h-full flex-col rounded-sm bg-white p-6 text-gray-800 shadow-lg">
          <div className="flex-1 overflow-auto">
            <CalendarComponent
              allEvents={allEvents}
              handleDateClick={handleDateClick}
              handleUpdateModal={handleUpdateModal}
              handleEventChange={handleEventChange}
            />
          </div>
        </div>

        <UpdateModal
          showUpdateModal={showUpdateModal}
          setShowUpdateModal={setShowUpdateModal}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          handleCloseModal={handleCloseModal}
          event={selectedEvent}
          handleChange={handleUpdateChange}
        />
        <AddEventModal
          showModal={showModal}
          setShowModal={setShowModal}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          newEvent={newEvent}
          handleCloseModal={handleCloseModal}
        />
      </main>
    </div>
  );
}
