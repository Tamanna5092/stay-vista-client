import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Card = ({ room }) => { 
    const startDate = new Date(room.from);
    const endDate = new Date(room.to)
    const diffTime = endDate - startDate
    const night = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return (
    <Link to={`/room/${room?._id}`} className="col-span-1 cursor-pointer group">
      <div className="flex flex-col gap-2 w-full">
        <div
          className="
              aspect-square 
              w-full 
              relative 
              overflow-hidden 
              rounded-xl
            "
        >
          <img
            className="
                object-cover 
                h-full 
                w-full 
                group-hover:scale-110 
                transition
              "
            src={room?.image}
            alt="Room"
          />
          <div
            className="
              absolute
              top-3
              right-3
            "
          ></div>
        </div>
        <div className="font-semibold text-lg">{room?.location}</div>
        <div className="font-light text-neutral-500">{night} nights</div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-semibold">$ {room?.price}</div>
          <div className="font-light">per night</div>
        </div>
      </div>
    </Link>
  );
};

Card.propTypes = {
  room: PropTypes.object,
};

export default Card;
