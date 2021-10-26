import React from 'react';
import BetButton from './BetButton';
import BalanceButton from './BalanceButton';
import './Header.css';

function Header({ bet, balance }) {
	return (
		<header>
			<BetButton
			value={ bet } />

			<img
			src="logo.png"
			alt="BLK JCK"
			className="logo" />

			<BalanceButton
			value={ balance } />
		</header>
	);
}

export default Header;