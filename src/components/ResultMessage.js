import React from 'react';
import './ResultMessage.css';

function ResultMessage({ message, gain }) {
	const color = (message === "BUSTED") ? "#ed5353" : null;

	return (
		<p
		className="finalMessage"
		style={{ color }}>
			{ message }

			{
				(gain) ?
				<div
				className="gainAlert"
				style={{ backgroundColor: "#ed5353" }}>
					<p>+{ gain }</p>
				</div> : null
			}
		</p>
	);
}

export default ResultMessage;