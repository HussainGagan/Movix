import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

import "./searchResult.scss";
import Spinner from "../../components/spinner/Spinner";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import InfiniteScroll from "react-infinite-scroll-component";
import MovieCard from "../../components/movieCard/MovieCard";

export default function SearchResult() {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const { query } = useParams();

  const fetchInitialData = () => {
    setLoading(true);
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        setData(res);
        setPageNum((prev) => prev + 1);
        setLoading(false);
      }
    );
  };

  const fetchNextPageData = () => {
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        if (data?.results) {
          setData((prevData) => {
            return {
              ...prevData,
              results: [...prevData.results, ...res.results],
            };
          });
        } else {
          setData(res);
        }
        setPageNum((prev) => prev + 1);
      }
    );
  };

  useEffect(() => {
    setData(null);
    setPageNum(1);
    fetchInitialData();
  }, [query]);

  return (
    <div className="searchResultsPage">
      {loading && <Spinner initial={true} />}
      {!loading && data && (
        <ContentWrapper>
          {data.results.length > 0 ? (
            <>
              <div className="pageTitle">
                {`Search ${
                  data.results.length > 1 ? "results" : "result"
                } for '${query}'`}
              </div>
              <InfiniteScroll
                className="content"
                dataLength={data.results.length || []}
                next={fetchNextPageData}
                hasMore={pageNum <= data.total_pages}
                loader={<Spinner />}
              >
                {data.results.map((item, index) => {
                  if (item.media_type === "person") return;
                  return (
                    <MovieCard key={index} data={item} fromSearch={true} />
                  );
                })}
              </InfiniteScroll>
            </>
          ) : (
            <span className="resultNotFound">Sorry, No Results Found!</span>
          )}
        </ContentWrapper>
      )}
    </div>
  );
}
