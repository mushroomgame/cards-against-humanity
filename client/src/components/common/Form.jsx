import React, { Component } from 'react';
import Button from '../common/Button';


export default class Form extends Component {
	state = {
		data: [],
		buttons: []
	}

	componentDidMount() {
		this.setState({ data: this.props.data, buttons: this.props.buttons });
	}

	onChange = (name, value) => {
		this.props.onChange && this.props.onChange(name, value);
		const data = [...this.state.data];
		let item = data.find(d => d.name === name);
		item.value = value;
		this.setState({ data });
	}

	drawItem({ type, name, value, placeholder, data }) {
		switch (type) {
			case 'password':
				return <input className="Input Form-Item-Input Form-Item-Input_Password" type="password" id={name} name={name} value={value} onChange={e => this.onChange(name, e.target.value)} />;
			case 'checkboxes':
				return <div className="Form-Item-Group Form-Item-Group_Checkboxes" >{value.map((c, index) =>
					<div key={`checkboxes_${index}`} className="Form-Item-Group-Item">
						<input type="checkbox" id={`${name}_${c.id}`} name={`${name}_${c.id}`} checked={c.checked && 'checked'} onChange={e => {
							let newValue = [...value];
							let v = newValue.find(n => n.id === c.id);
							v.checked = !v.checked;
							this.onChange(name, newValue);
						}} />
						<label className="Form-Item-Input Form-Item-Input_Checkbox" htmlFor={`${name}_${c.id}`}>{c.name}{c.count ? <span className="Counter">{c.count}</span> : ''}</label>
					</div>
				)}</div>;
			case 'radio':
				return <div className="Form-Item-Group Form-Item-Group_Radio" >{data.map((r, index) =>
					<div key={`checkboxes_${index}`} className="Form-Item-Group-Item">
						<input type="radio" id={`${name}_${r.name}`} name={`${name}`} value={r.value} checked={value === r.value && 'checked'} onChange={e => {
							this.onChange(name, e.target.value);
						}} />
						<label className="Form-Item-Input Form-Item-Input_Radio" htmlFor={`${name}_${r.name}`}>{r.name}</label>
					</div>
				)}</div>;
			case 'textarea':
				return <textarea className="Input Form-Item-Input Form-Item-Input_TextArea" placeholder={placeholder} id={name} name={name} value={value} onChange={e => this.onChange(name, e.target.value)}></textarea>;
			case 'text':
			default:
				return <input className="Input Form-Item-Input Form-Item-Input_Text" placeholder={placeholder} type="text" id={name} name={name} value={value} onChange={e => this.onChange(name, e.target.value)} />;
		}
	}

	render() {
		return (
			<form className="Form">
				<div className="Form-Items">{this.state.data.map((d, index) =>
					<div className="Form-Item" key={`form_item_${index}`}>
						{d.label && <label className="Form-Item-Title" htmlFor={d.name}>{d.label}</label>}
						{this.drawItem(d)}
					</div>
				)}</div>
				<div className="Form-Buttons">{this.state.buttons.map((b, index) =>
					<Button className="Button_Wide" onClick={b.onClick} key={`form_button_${index}`} color={b.color}>{b.label}</Button>
				)}</div>
			</form>
		);
	}
}