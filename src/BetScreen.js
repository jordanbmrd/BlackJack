import React from 'react';
import Header from './components/Header';
import StyledButton from './components/StyledButton';
import Chip from './components/Chip';
import BetDisplayer from './components/BetDisplayer';
import './BetScreen.css';

function BetScreen({ actualBet, actualBalance, initGame, increaseBet, removeBet }) {
	return (
		<div
		className="betScreen">
			<Header
			bet={ actualBet }
			balance={ actualBalance } />

			<BetDisplayer
			amount={ actualBet }
			removeBet={ removeBet } />
			
			<div className="chipButtons">
				<div className="chipList">
					<Chip
					value="5"
					action={increaseBet} />
					<Chip
					value="25"
					action={increaseBet} />
					<Chip
					value="50"
					action={increaseBet} />
					<Chip
					value="100"
					action={increaseBet} />
					<Chip
					value="500"
					action={increaseBet} />
					<Chip
					value="All"
					action={increaseBet}
					balance={actualBalance} />
				</div>
			</div>

			<footer
			className="betButtons">
				<StyledButton
				text={(actualBet === 0) ? "Play without bet" : "Save bet"}
				action={() => initGame(actualBet, 1)} />
				<StyledButton
				text="Cancel"
				styleChoosed="low"
				action={removeBet} />
			</footer>

			<small className="disclaimer">Made with <span className="red">❤</span>&nbsp;by Jordan - Design inspired by Alex Penny - <a href="https://paypal.me/jordanbaumard" className="link" target="_blank" rel="noreferrer">Pay me a coffee</a></small>

		</div>
	);
}

export default BetScreen;