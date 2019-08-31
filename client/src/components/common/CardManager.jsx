import React, { Component } from 'react';

import cardService from '../../services/cardService';
import Table from './Table';
import Button from './Button';
import whevent from 'whevent';
import Popup from './Popup';
import Form from './Form';

class CardManager extends Component {
	state = {
		cards: [],
		headers: [
			{ label: 'id', value: '_id', flex: 1 },
			{ label: '内容', value: 'text', flex: 4 },
			{ label: '标签', value: 'tags', flex: 1 },
			{ label: '游玩数', value: 'plays', flex: 1 },
			{ label: '评价', value: 'votes', flex: 1 },
			{ label: '提交时间', value: 'created_at', flex: 2 },
			{ label: '状态', value: 'status', flex: 1 },
			{ label: '操作', value: 'operations', flex: 1 }
		]
	}


	async componentDidMount() {
		const cards = this.props.type === 'black' ? await cardService.getBlackCards() : await cardService.getWhiteCards();
		this.setState({ cards });
	}

	onDrawCell = (data, header) => {
		switch (header) {
			case 'author':
				let author = data.tags.find(t => t.startsWith('@'));
				if (author) {
					author = author.substr(1);
				} else {
					author = '';
				}
				return author;
			case 'status':
				return data.status ? '启用' : '禁用';
			case 'tags':
				return data.tags.join(',');
			case 'operations':
				return <div className="CardManager-Operations">
					{/* <Button onClick={() => this.onClickSave(data)} className="Save" color="#469"><i className="icon-floppy-disk"></i></Button> */}
					<Button onClick={e => e.stopPropagation() | this.onClickToggle(data)} className="Toggle" color={data.status ? "#c64" : "#4c6"}><i className={data.status ? "icon-cross" : "icon-checkmark"}></i></Button>
					<Button onClick={e => e.stopPropagation() | this.onClickDelete(data)} className="Delete" color="#c44"><i className="icon-bin"></i></Button>
				</div>;
			default:
				return data[header];
		}
	}

	onClickCell = (card, { target }) => {
		const header = target.getAttribute('data-header');
		if (['text', 'tags'].includes(header)) {
			let value = card[header];

			let data = [
				{ name: 'text', type: 'textarea', label: this.state.headers.find(h => h.value === header).label, value }
			];
			const onChange = (name, value) => {
				data.find(d => d.name === name).value = value;
			}
			const onSubmit = async () => {
				const cards = [...this.state.cards];
				const c = cards.find(_c => _c._id === card._id);

				const changes = {};
				if (header === 'tags') {
					let tags = data.find(d => d.name === 'text').value.split(',').map(t => t.trim());
					changes[header] = JSON.stringify(tags);
					c[header] = tags;
				} else {
					changes[header] = data.find(d => d.name === 'text').value;
					c[header] = changes[header];
				}
				whevent.call('LOADING', '提交中');
				await cardService.alterCard(card._id, this.props.type, changes);
				whevent.call('LOADING');
				whevent.call('POPUP', 'ALTER_CARD');

				this.setState({ cards });
			}

			const popup = <Form onChange={onChange} data={data} buttons={[{ label: '提交', onClick: onSubmit, color: '#999' }]} />;
			whevent.call('POPUP', 'ALTER_CARD', popup);
		}
	}

	// onClickSave = data => {
	// 	console.log('save', data);
	// }

	onClickToggle = async card => {
		const id = card._id;
		const changes = { status: card.status === 1 ? 0 : 1 };
		whevent.call('LOADING', '提交中...');
		await cardService.alterCard(id, this.props.type, changes);
		whevent.call('LOADING');

		const cards = [...this.state.cards];
		let c = cards.find(c => c._id === card._id);
		if (c) {
			c.status = c.status === 1 ? 0 : 1;
			this.setState({ cards });
		}
	}

	onClickDelete = async data => {
		if (window.confirm(`确认删除卡牌【${data.text}】？`)) {
			whevent.call('LOADING', '提交中...');
			await cardService.deleteCard(data._id, this.props.type);
			whevent.call('LOADING');
			const cards = [...this.state.cards].filter(c => c._id !== data._id);
			this.setState({ cards });
		}
	}

	render() {
		const { headers, cards } = this.state;
		return (
			<section className="CardManager">
				<h1 className="CardManager-Title">管理卡牌</h1>
				<Table headers={headers} data={cards} onDrawCell={this.onDrawCell} onClickCell={this.onClickCell} />
			</section>
		);
	}
}

export default CardManager;