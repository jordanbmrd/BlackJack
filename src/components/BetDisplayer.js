import React from 'react';
import './BetDisplayer.css';

function BetDisplayer({ amount, removeBet }) {
	return (
		<div
		className="betDisplayer">
			<div
			className="amount">
				<p>{ amount.toString().padStart(4, '0') }</p>
			</div>

			<div
			className="removeButton"
			onClick={removeBet}>
				<p>&times;</p>
			</div>
		</div>
	);
}

export default BetDisplayer;