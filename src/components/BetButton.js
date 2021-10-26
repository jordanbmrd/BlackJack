import React from 'react';
import { Money } from 'grommet-icons';
import './BetButton.css';

function BetButton({ value }) {
	return (
		<div className="betButton">
			<Money
			color="#ed5353" />
			<span>
				{ value }
			</span>
		</div>
	);
}

export default BetButton;