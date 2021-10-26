import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import Header from './components/Header';
import StyledButton from './components/StyledButton';
import ResultMessage from './components/ResultMessage';
import './GameScreen.css';

function GameScreen({ dealerDeck, dealerTotal, playerDeck, playerTotal, actualBet, actualBalance, result, bust, gain, canDouble, hasDoubled, hit, double, stand, initGame, canBet }) {
	const bustResultStyle = { textDecoration: "line-through", textDecorationColor: "#ed5353" };

	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	const updateWindowDimensions = () => {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	}

	// Component did mount
	useEffect(() => {
		updateWindowDimensions();
		window.addEventListener('resize', updateWindowDimensions);
	}, []);

	return (
		<div
		className="gameScreen">

			<Header
			bet={ actualBet }
			balance={ actualBalance } />

			{
				(result === "WINNER") ?
				<Confetti
				width={ width }
				height={ height } /> : null
			}

			<div className="game">
				<div className="dealerGame">
					{ dealerDeck.map((card, i) => (
						<img
						key={i}
						src={card.image}
						alt={card.code}
						className="cardImage" />
					)) }
					<p className="scoreTotal"
					style={ (bust === 0) ? bustResultStyle : null}>{ dealerTotal }</p>
				</div>

				<ResultMessage
				message={ result }
				gain={ gain } />

				<div className="playerGame">
					{ playerDeck.map((card, i) => (
						<img
						key={i}
						src={card.image}
						alt={card.code}
						className="cardImage" />
					)) }
					<p
					className="scoreTotal"
					style={ (bust === 1) ? bustResultStyle : null}>{ playerTotal }</p>
				</div>
			</div>

			{
				result ?
				<footer
				className="gameBottomButton">
					<StyledButton
					text="Okay"
					action={() => initGame(canBet(actualBalance, actualBet) ? (hasDoubled) ? actualBet/2  : actualBet : 0, 0, 0)} />
				</footer>
				:
				<footer
				className="gameBottomButton">
					<StyledButton
					text="Push"
					action={hit} />
					{
						canDouble ?
						<StyledButton
						text="Double"
						action={double} />
						: null
					}
					<StyledButton
					text="Stand"
					action={stand} />
				</footer>
			}

		</div>
	);
}

export default GameScreen;