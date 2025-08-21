import PropTypes from "prop-types";
import Button from "../Shared/Button/Button";
import { DateRange } from "react-date-range";
import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";

const RoomReservation = ({ room }) => {
  console.log("startDate", new Date(room.from).toLocaleString());
  console.log("endDate", new Date(room.to).toLocaleString());
  const [state, setState] = useState([
    {
      startDate: new Date(room.from),
      endDate:  new Date(room.to),
      key: 'selection'
    }
  ]);

  // total price * day
  const totalPrice = parseInt(
    differenceInCalendarDays(new Date(room.to), new Date(room.from))
  ) * room?.price;
  console.log("totalPrice", totalPrice);

  return (
    <div className="rounded-xl border-[1px] border-neutral-200 overflow-hidden bg-white">
      <div className="flex items-center gap-1 p-4">
        <div className="text-2xl font-semibold">$ {room?.price}</div>
        <div className="font-light text-neutral-600">/night</div>
      </div>
      <hr />
      <div className="flex justify-center">
        {/* Calender */}
        <DateRange
          rangeColors={["#F6536D"]}
          showDateDisplay={false}
          editableDateInputs={true}
          onChange={(item) => {
            console.log("onChange", item);
            setState([
              {
              startDate: new Date(room.from),
              endDate: new Date(room.to),
              key: "selection",
            }
            ]);
          }}
          moveRangeOnFirstSelection={false}
          ranges={state}
        />
      </div>
      <hr />
      <div className="p-4">
        <Button label={"Reserve"} />
      </div>
      <hr />
      <div className="p-4 flex items-center justify-between font-semibold text-lg">
        <div>Total</div>
        <div>${totalPrice}</div>
      </div>
    </div>
  );
};

RoomReservation.propTypes = {
  room: PropTypes.object,
};

export default RoomReservation;
