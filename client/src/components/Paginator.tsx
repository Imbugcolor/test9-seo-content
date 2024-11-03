import React from 'react'

export interface ListData {
    data: unknown[];
    total: number;
    page: number;
}

export default function Paginator<T extends ListData>(
    { list, limit, callback }:
        { list: T, limit?: number, callback: (num: number) => void }
) {
    const { page, total } = list

    const totalPages = Math.ceil(total / (limit ? limit : 10))

    // Calculate the start and end of the page range
    const startPage = Math.max(1, page - 3);
    const endPage = Math.min(totalPages, page + 3);

    // Generate the array of page numbers to display
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const isActive = (index: number) => {
        if (index === page) return 'active';
        return ''
    }

    const handlePagination = (num: number) => {
        // dispatch({type: CHANGE_PAGE, payload: num })
        callback(num)
    }

    return (
        <nav aria-label="Page navigation example"
            style={{ cursor: 'pointer' }}>
            <ul className="my-pagination">
                {
                    page > 1 &&
                    <li className="page-item" onClick={() => handlePagination(page - 1)}>
                        <span className="page-redirect-link" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </span>
                    </li>
                }

                {
                    pages.map(num => (
                        <li key={num} className={`page-item ${isActive(num)}`}
                            onClick={() => handlePagination(num)}>
                            <span className="page-redirect-link">
                                {num}
                            </span>
                        </li>
                    ))
                }

                {
                    page < totalPages &&
                    <li className="page-item"
                        onClick={() => handlePagination(page + 1)}>
                        <span className="page-redirect-link" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </span>
                    </li>
                }

            </ul>
        </nav>
    )
}