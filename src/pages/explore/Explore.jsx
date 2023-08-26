import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

import "./explore.scss";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import Select from "react-select";
import useFetch from "../../hooks/useFetch";
import Spinner from "../../components/spinner/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import MovieCard from "../../components/movieCard/MovieCard";

let filters = {};

const sortByData = [
  { value: "popularity.desc", label: "Popularity Descending" },
  { value: "popularity.asc", label: "Popularity Ascending" },
  { value: "vote_average.desc", label: "Rating Descending" },
  { value: "vote_average.asc", label: "Rating Ascending" },
  {
    value: "primary_release_date.desc",
    label: "Release Date Descending",
  },
  { value: "primary_release_date.asc", label: "Release Date Ascending" },
  { value: "original_title.asc", label: "Title (A-Z)" },
];

export default function Explore() {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  const { mediaType } = useParams();

  const { data: genresData } = useFetch(`/genre/${mediaType}/list`);

  const fetchInitialData = () => {
    setLoading(true);
    fetchDataFromApi(`/discover/${mediaType}`, filters).then((res) => {
      setLoading(false);
      setData(res);
      setPageNum((prev) => prev + 1);
    });
  };

  const fetchNextPageData = () => {
    fetchDataFromApi(`/discover/${mediaType}/?page=${pageNum}`, filters).then(
      (res) => {
        if (data?.results) {
          setData((prevData) => ({
            ...prevData,
            results: [...prevData?.results, ...res.results],
          }));
        } else {
          setData(res);
        }
        setPageNum((prev) => prev + 1);
      }
    );
  };

  useEffect(() => {
    filters = {};
    setData(null);
    setPageNum(1);
    setGenre(null);
    setSortBy(null);
    fetchInitialData();
  }, [mediaType]);

  const handleChange = (selectedItems, action) => {
    // console.log(selectedItems, action);
    if (action.name === "sortBy") {
      setSortBy(selectedItems);
      if (action.action !== "clear") {
        filters.sort_by = selectedItems.value;
      } else {
        delete filters.sort_by;
      }
    }

    if (action.name === "genres") {
      setGenre(selectedItems);
      if (action.action !== "clear") {
        let genreId = selectedItems.map((item) => item.id);
        filters.with_genres = String(genreId);
      } else {
        delete filters.with_genres;
      }
    }

    setPageNum(1);
    fetchInitialData();
  };

  return (
    <div className="explorePage">
      <ContentWrapper>
        <div className="pageHeader">
          <div className="pageTitle">
            {mediaType === "tv" ? "Explore TV Shows" : "Explore Movies"}
          </div>
          <div className="filters">
            <Select
              isMulti
              name="genres"
              value={genre}
              closeMenuOnSelect={false}
              options={genresData?.genres}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              onChange={handleChange}
              placeholder="Select Genres"
              className="react-select-container genresDD"
              classNamePrefix="react-select"
            />
            <Select
              name="sortBy"
              value={sortBy}
              options={sortByData}
              onChange={handleChange}
              isClearable={true}
              placeholder="Sort By"
              className="react-select-container sortbyDD"
              classNamePrefix="react-select"
            />
          </div>
        </div>
        {loading && <Spinner initial={true} />}
        {!loading && data && (
          <>
            {data.results.length > 0 ? (
              <InfiniteScroll
                className="content"
                dataLength={data.results.length}
                next={fetchNextPageData}
                hasMore={pageNum <= data.total_pages}
                loader={<Spinner />}
              >
                {data.results.map((item, index) => (
                  <MovieCard key={index} data={item} mediaType={mediaType} />
                ))}
              </InfiniteScroll>
            ) : (
              <span className="resultNotFound">Sorry, No results found</span>
            )}
          </>
        )}
      </ContentWrapper>
    </div>
  );
}
