import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AvailabilitySlot } from '../../types';
import { addAvailabilitySlot, removeAvailabilitySlot, updateAvailabilitySlot } from '../../data/meetings';

interface MeetingCalendarProps {
  entrepreneurId: string;
  slots: AvailabilitySlot[];
  onSlotsChange?: (slots: AvailabilitySlot[]) => void;
}

export const MeetingCalendar: React.FC<MeetingCalendarProps> = ({
  entrepreneurId,
  slots,
  onSlotsChange
}) => {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState(30);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);

  useEffect(() => {
    if (slots.length > 0) {
      setSelectedDay(new Date(slots[0].date));
    }
  }, [slots]);

  const handleAddOrUpdateSlot = () => {
    if (!date || !time) return;

    if (editingSlotId) {
      const updated = updateAvailabilitySlot(editingSlotId, {
        date,
        time,
        durationMinutes: duration
      });
      if (updated && onSlotsChange) {
        onSlotsChange(slots.map(slot => slot.id === editingSlotId ? updated : slot));
      }
      setEditingSlotId(null);
      return;
    }

    const newSlot = addAvailabilitySlot(entrepreneurId, date, time, duration);
    if (onSlotsChange) {
      onSlotsChange([...slots, newSlot]);
    }
  };

  const handleEditSlot = (slot: AvailabilitySlot) => {
    setEditingSlotId(slot.id);
    setDate(slot.date);
    setTime(slot.time);
    setDuration(slot.durationMinutes);
  };

  const handleRemoveSlot = (slotId: string) => {
    if (removeAvailabilitySlot(slotId) && onSlotsChange) {
      onSlotsChange(slots.filter(slot => slot.id !== slotId));
    }
  };

  const selectedDate = selectedDay.toDateString();

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Meeting Calendar</h2>

          <Calendar
            onChange={(value) => setSelectedDay(value as Date)}
            value={selectedDay}
          />

          <p className="mt-4 text-gray-600">Selected Date: {selectedDate}</p>
        </div>

        <div className="w-full lg:w-[320px] bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="text-md font-semibold text-gray-900 mb-3">Manage Availability</h3>

          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 mb-3 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />

          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 mb-3 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />

          <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
          <input
            type="number"
            min={15}
            step={15}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1 mb-4 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />

          <button
            type="button"
            onClick={handleAddOrUpdateSlot}
            className="inline-flex items-center justify-center w-full rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
          >
            {editingSlotId ? 'Save Slot' : 'Add Slot'}
          </button>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Available Slots</h3>
            {slots.length > 0 ? (
              <div className="space-y-3">
                {slots.map(slot => (
                  <div key={slot.id} className="rounded-lg border border-gray-200 bg-white p-3">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{slot.date} · {slot.time}</p>
                        <p className="text-sm text-gray-500">{slot.durationMinutes} min</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditSlot(slot)}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(slot.id)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No availability slots yet. Add a time slot to start receiving meeting requests.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
