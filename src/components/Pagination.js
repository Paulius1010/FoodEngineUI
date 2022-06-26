import React from 'react'

import ReactPaginate from "react-paginate";

function Pagination(props) {
  // let {pageCount} = props;
  // let {handlePageClick} = props;
  // console.log(props.onPageChange);
  return (
    <div>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={props.pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={props.onPageChange}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  )
}

export default Pagination