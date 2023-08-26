import React from "react";
import { useSelector } from "react-redux";

import "./genres.scss";

const Genres = ({ data }) => {
  const { genres } = useSelector((state) => state.home);

  return (
    <div className="genres">
      {data?.map((gid) => {
        if (!genres[gid]?.name) return;
        return (
          <div key={gid} className="genre">
            {genres[gid]?.name}
          </div>
        );
      })}
    </div>
  );
};

export default Genres;
