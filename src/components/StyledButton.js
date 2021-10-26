import React from 'react';
import './StyledButton.css';

function StyledButton({ text, styleChoosed, action }) {
	const backgroundColor = (styleChoosed === "low") ? "#f2bcbc" : "#ed5353";
	const color = (styleChoosed === "low") ? "#F3201F" : "#FFF";

	if (!action) action = () => {};

	return (
		<div
		style={{ backgroundColor }}
		className="styledButton"
		onClick={() => action()}>
			<p
			style={{ color }}>{ text }</p>
		</div>
	);
}

export default StyledButton;