import React, { Component } from "react";
import ReactMarkdown from "react-markdown/with-html";
import _ from "lodash";
import whevent from "whevent";
import CodeBlock from '../addons/CodeBlock';

export default class Article extends Component {
	constructor(props) {
		super(props);
		this.state = {
			source: null
		};
	}

	componentWillMount() {
		whevent.bind("LANGUAGE_CHANGED", this.onLanguageChanged, this);
		this.fetchArticle();
	}

	componentWillUnmount() {
		whevent.unbind("LANGUAGE_CHANGED", this.onLanguageChanged, this);
	}

	onLanguageChanged() {
		this.fetchArticle();
	}

	fetchArticle = async () => {
		const result = await fetch(`./articles/${this.props.source}.md`);
		const text = await result.text();

		if (text.indexOf("<!DOCTYPE html>") === 0) {
			this.setState({ ready: true, source: "" });
		} else if (text) {
			const processedArticle = await this.processArticle(text);
			this.setState({ source: processedArticle }, this.replaceBlack);
		}
	};

	processArticle(text) {
		let regex;
		let result;
		if (this.props.data) {
			regex = /\{(\w+)\}/;
			while ((result = regex.exec(text))) {
				text = _.replace(text, result[0], this.props.data[result[1]]);
			}
		}

		text = text.replace(/\\\{/g, "{");
		text = text.replace(/\\\}/g, "}");

		return text;
	}

	replaceBlack() {
		const regex = /@@(.+)@@/;
		[...document.getElementsByTagName("code")].forEach(ele => {
			let text = ele.innerHTML;
			let strings = text.split(regex);
			if (strings.length === 3) {
				ele.innerHTML = strings[0] + `<span className="spoiler">${strings[1]}</span>` + strings[2];
			}
		});
	}

	render() {
		const { source } = this.state;
		const { data, ...rest } = this.props;
		return (
			<div className="Article" {...rest}>
				{source && <ReactMarkdown renderers={{ code: CodeBlock }} source={source} escapeHtml={false} />}
			</div>
		);
	}
}
