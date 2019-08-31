import React, { Component } from 'react';

const Pagination = ({ currentPage, totalPages, onMoveToPage }) => {
	let start = 0;
	if (totalPages - currentPage <= 3) {
		start = Math.max(currentPage - (6 - (totalPages - currentPage)), 1);
	} else {
		start = Math.max(currentPage - 3, 1);
	}
	let end = Math.min(start + 6, totalPages);
	let pages = [];
	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	return (
		<ul className="Pagination">
			<li onClick={() => onMoveToPage && onMoveToPage(1)}><i className="icon-next2 XFlip"></i></li>
			<li onClick={() => onMoveToPage && onMoveToPage(Math.max(currentPage - 1, 1))}><i className="icon-play3 XFlip"></i></li>
			{pages.map(p =>
				<li className={currentPage === p ? 'Current' : ''} onClick={() => onMoveToPage && onMoveToPage(p)} key={'page_' + p}>{p}</li>
			)}
			<li onClick={() => onMoveToPage && onMoveToPage(Math.min(currentPage + 1, totalPages))}><i className="icon-play3"></i></li>
			<li onClick={() => onMoveToPage && onMoveToPage(totalPages)}><i className="icon-next2"></i></li>
		</ul>
	);
}

export default Pagination;