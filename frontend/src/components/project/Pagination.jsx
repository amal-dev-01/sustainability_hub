import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import '../../assets/styles/PaginationComponent.css';

const PaginationComponent = ({ count, page, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(count / pageSize);
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const pages = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      pages.push(i);
    }

    if (page - delta > 2) pages.unshift('...');
    if (page + delta < totalPages - 1) pages.push('...');

    pages.unshift(1);
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="d-flex justify-content-center mt-4">
      <Pagination className="custom-pagination">
        <Pagination.Prev
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        />
        {visiblePages.map((p, i) =>
          p === '...' ? (
            <Pagination.Ellipsis key={i} disabled />
          ) : (
            <Pagination.Item
              key={i}
              active={page === p}
              onClick={() => onPageChange(p)}
            >
              {p}
            </Pagination.Item>
          )
        )}
        <Pagination.Next
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        />
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
