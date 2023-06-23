import React from 'react';
import './pagination.css';

interface PaginationProps {
    countriesPerPage: number;
    totalCountries: number;
    currentPage: number;
    paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ countriesPerPage, totalCountries, currentPage, paginate }) => {
    const pageNumbers: number[] = [];

    for (let i = 1; i <= Math.ceil(totalCountries / countriesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            {pageNumbers.map((pageNumber) => (
                <button
                    key={pageNumber}
                    className={pageNumber === currentPage ? 'pagination-number active' : 'pagination-number'}
                    onClick={() => paginate(pageNumber)}
                >
                    {pageNumber}
                </button>
            ))}
        </div>
    );
};

export default Pagination;
