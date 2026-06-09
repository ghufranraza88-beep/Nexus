import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export const MeetingCalendar: React.FC = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">
        Meeting Calendar
      </h2>

      <Calendar
        onChange={(value) => setDate(value as Date)}
        value={date}
      />

      <p className="mt-4 text-gray-600">
        Selected Date: {date.toDateString()}
      </p>
    </div>
  );
};