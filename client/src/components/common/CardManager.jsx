import React, { Component } from 'react';

import cardService from '../../services/cardService';
import Table from './Table';
import Button from './Button';

class CardManager extends Component {
	state = {
		whiteCards: [],
		blackCards: [],
		headers: [
			{ label: 'id', value: '_id', flex: 1 },
			{ label: '内容', value: 'text', editable: true, flex: 4 },
			{ label: '作者', value: 'author', editable: true, flex: 1 },
			{ label: '提交时间', value: 'created_at', flex: 2 },
			{ label: '更新时间', value: 'updated_at', flex: 2 },
			{ label: '状态', value: 'status', flex: 1 },
			{ label: '操作', value: 'operations', flex: 1 }
		]
	}


	async componentDidMount() {
		const blackCards = await cardService.getBlackCards();
		this.setState({ blackCards });
	}

	onDrawCell = (data, header) => {
		switch (header) {
			case 'author':
				let author = data.tags.find(t => t.startsWith('@'));
				if (author) {
					author = author.substr(1);
				} else {
					author = '系统';
				}
				return author;
			case 'status':
				return data.status ? '启用' : '禁用';
			case 'operations':
				return <div className="CardManager-Operations">
					{/* <Button onClick={() => this.onClickSave(data)} className="Save" color="#469"><i className="icon-floppy-disk"></i></Button> */}
					<Button onClick={() => this.onClickToggle(data)} className="Toggle" color={data.status ? "#c64" : "#4c6"}><i className={data.status ? "icon-cross" : "icon-checkmark"}></i></Button>
					<Button onClick={() => this.onClickDelete(data)} className="Delete" color="#c44"><i className="icon-bin"></i></Button>
				</div>;
			default:
				return data[header];
		}
	}

	onClickCell = data => {
		console.log(data);
	}

	onClickSave = data => {
		console.log('save', data);
	}

	onClickToggle = data => {
		console.log('toggle', data);
	}

	onClickDelete = data => {
		console.log('delete', data);
	}

	render() {
		const { headers, blackCards, whiteCards } = this.state;
		return (
			<section className="CardManager">
				<h1 className="CardManager-Title">管理卡牌</h1>
				<Table headers={headers} data={blackCards} onDrawCell={this.onDrawCell} onClickCell={this.onClickCell} />
			</section>
		);
	}
}

export default CardManager;