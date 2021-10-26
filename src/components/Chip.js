import React from 'react';
import './Chip.css';

function Chip({ balance, value, action }) {
	return (
		<div
		className="chip"
		onClick={() => action(value)}>
			<p>{ value }</p>
		</div>
	);
}

export default Chip;