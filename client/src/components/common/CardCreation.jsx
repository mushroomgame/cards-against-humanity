import React, { Component } from 'react';
import Form from './Form';
import alerter from '../../utils/alerter';
import ProgressBar from './ProgressBar';
import { submitCard } from '../../services/cardService';
import global from '../../services/global';

let data = [
	{ name: 'type', type: 'radio', label: '卡牌类型', data: [{ name: '黑卡', value: 'black' }, { name: '白卡', value: 'white' }], value: 'black' },
	{ name: 'text', type: 'textarea', label: '卡牌内容', value: '' },
	{ name: 'tags', type: 'tags', label: '卡牌标签', placeholder: '非必填，多个标签请用半角逗号隔开，例：A岛,网络用语', value: '' }
];


class CardCreation extends Component {
	state = {
		submitting: false,
		warned: false,
		total: 0,
		completed: 0
	}

	componentWillMount() {
		let buttons = [{ label: '提交', onClick: this.onCreate, color: '#999' }];
	}

	onChange = (name, value) => {
		let d = data.find(d => d.name === name);
		d.value = value;
	}

	onCreate = async () => {
		if (this.state.submitting) return;
		const type = data.find(d => d.name === 'type').value;
		const textRaw = data.find(d => d.name === 'text').value.trim();
		const tagsRaw = data.find(d => d.name === 'tags').value.trim();

		if (!textRaw) {
			alerter.alert('请填写卡牌内容！');
			return;
		}

		const texts = [...new Set(textRaw.split('\n').map(t => t.trim()))];

		for (let t of texts) {
			let result = this.validateCard(type, t);
			console.log(result);
			if (!result.valid) {
				alerter.alert(result.message);
				return;
			}
		}

		let tags = tagsRaw.split(',');
		tags.push('玩家自制');
		tags.push('@' + global.nickname);
		tags = [...new Set(tags)];

		const cards = texts.map(t => ({ text: t, type, tags }));
		let completed = 0;
		this.setState({ total: cards.length, completed, submitting: true });
		for (let card of cards) {
			await submitCard(card);
			completed++;
			this.setState({ completed });
		}
		alerter.info('卡牌提交成功！');
		data.find(d => d.name === 'text').value = '';
		data.find(d => d.name === 'tags').value = '';
		this.setState({ submitting: false });
	}

	validateCard(type, text) {
		if (type === 'white') {
			if (text.length < 1) {
				return { valid: false, message: `白卡【${text}】过短` };
			}

			if (text.length > 100) {
				return { valid: false, message: `白卡【${text}】过长` };
			}

			let blanks = text.split('_').length - 1;
			if (blanks > 0 && !this.state.warned) {
				this.setState({ warned: true });
				return { valid: false, message: `【${text}】似乎是一张黑卡，您确定要提交为白卡吗？` };
			}

			return { valid: true };
		} else if (type === 'black') {
			if (text.length > 300) {
				return { valid: false, message: `黑卡【${text}】过长` };
			}
			let blanks = text.split('_').length - 1;
			if (blanks === 0) {
				return { valid: false, message: `黑卡【${text}】至少需要一个填空` };
			} else if (blanks > 4) {
				return { valid: false, message: `黑卡【${text}】填空过多，最多不能超过4个！` };
			}
			return { valid: true };
		} else {
			return { valid: false, message: '未知卡牌类型' };
		}
	}

	render() {
		return (
			<section className="CardCreation">
				<h1 className="CardCreation-Title">制作卡牌</h1>
				<span className="CardCreation-Help">黑卡的下划线请用单个<code>_</code>代替</span>
				<span className="CardCreation-Help">同时提交多张卡时请换行</span>
				<Form data={data} onChange={this.onChange} buttons={[{ label: '提交', onClick: this.onCreate, color: '#999' }]} />
				<ProgressBar text="正在提交" completed={this.state.completed} total={this.state.total} />
			</section>
		);
	}
}

export default CardCreation;