import React from "react";
import DetailsBanner from "./detailsBanner/DetailsBanner";

import "./details.scss";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Cast from "./cast/Cast";
import VideosSection from "./videosSection/VideosSection";
import Similar from "./carousels/Similar";
import Recommendation from "./carousels/Recommendation";

export default function Details() {
  const { mediaType, id } = useParams();
  const { data: videos, loading: videosLoading } = useFetch(
    `/${mediaType}/${id}/videos`
  );
  const { data: credits, loading: creditsLoading } = useFetch(
    `/${mediaType}/${id}/credits`
  );
  const trailer = videos?.results.find((vid) => vid.type === "Trailer");
  return (
    <div>
      <DetailsBanner video={trailer} crew={credits?.crew} />
      <Cast data={credits?.cast} loading={creditsLoading} />
      <VideosSection data={videos} loading={videosLoading} />
      <Similar mediaType={mediaType} id={id} />
      <Recommendation mediaType={mediaType} id={id} />
    </div>
  );
}
