import React from 'react';
import { CreditCard } from 'grommet-icons';
import './BalanceButton.css';

function BalanceButton({ value }) {
	return (
		<div className="balanceButton">
			<CreditCard
			color="#000" />
			<span>
				{ value }
			</span>
		</div>
	);
}

export default BalanceButton;