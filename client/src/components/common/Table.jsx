import React, { Component } from 'react';
import Pagination from './Pagination';

class Table extends Component {
	state = {
		currentPage: 1
	}

	onMoveToPage = page => {
		this.setState({ currentPage: page });
	}

	getPaginatedData(data, itemsPerPage, currentPage) {
		return data.filter((d, index) => index >= itemsPerPage * (currentPage - 1) && index < itemsPerPage * (currentPage - 1) + itemsPerPage);
	}

	render() {
		const { headers, data, onDrawCell, onDrawHead, onClickCell } = this.props;
		const { currentPage } = this.state;
		const itemsPerPage = this.props.itemsPerPage || 10;
		const totalPages = Math.ceil(this.props.data.length / itemsPerPage) || 1;
		const paginatedData = this.getPaginatedData(data, itemsPerPage, currentPage);

		return (
			<div className="Table">
				<table>
					<thead>
						<tr>{headers.map((h, index) =>
							<th key={`head_${index}`} style={{ '--flex': h.flex || 1 }}>{(onDrawHead && onDrawHead(h)) || h.label}</th>
						)}</tr>
					</thead>
					<tbody>{paginatedData.map((d, row) =>
						<tr key={`row_${row}`}>{headers.map((h, col) =>
							<td key={`cell_${row}_${col}`} onClick={() => onClickCell && onClickCell(d)} style={{ '--flex': h.flex || 1 }}>
								{(onDrawCell && onDrawCell(d, h.value)) || d[h.value]}
							</td>
						)}</tr>
					)}</tbody>
				</table>
				<Pagination onMoveToPage={this.onMoveToPage} totalPages={totalPages} currentPage={currentPage} />
			</div>
		);
	}
}

export default Table;