import { Component } from 'react';
import BetScreen from './BetScreen';
import GameScreen from './GameScreen';
import './App.css';

const RESULTS = ["LOST", "BUSTED", "WINNER", "PUSH", "ERROR"];

class App extends Component {
  constructor() {
    super();

    this.state = {
      deckId: '',
      result: '',
      bust: -1, // who have busted ? -1: none, 0: dealer, 1: player
      dealerDeck: [],
      playerDeck: [],
      dealerTotal: 0,
      playerTotal: 0,
      intervalId: 0,
      gain: 0,
      isPlaying: 0, // is player betting ? 0: yes, 1: no so play game
      canDouble: true, // can double only the first round
      hasDoubled: false, // to put back the previous bet after doubled

      lastBet: 0,
      actualBet: 0,
      actualBalance: 2000,
    }

    this.double = this.double.bind(this);
    this.stand = this.stand.bind(this);
    this.takeCard = this.takeCard.bind(this);
  }

  componentDidMount() {
    this.initGame();
  }

  initGame = (bet = 0, isPlaying = 0, place = 1) => {
    // place: 0 game launched from another game
    // place: 1 game launched from bet menu

    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then(res => res.json())
    .then(data => {

      console.log(data.deck_id);
      this.setState({
        deckId: data.deck_id,
        result: '',
        bust: -1,
        dealerDeck: [],
        playerDeck: [],
        dealerTotal: 0,
        playerTotal: 0,
        intervalId: 0,
        gain: 0,
        isPlaying,
        canDouble: this.canBet(this.state.actualBalance, this.state.actualBet) ? true : false,
        hasDoubled: false,

        actualBet: bet,
        actualBalance: (place === 0 && this.canBet(this.state.actualBalance, bet)) ? this.state.actualBalance - bet : this.state.actualBalance,
      }, () => {
        this.dealCards();
      });

    });
  }

  dealCards = () => {
    fetch(`https://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=3`)
    .then(res => res.json())
    .then(data => {

      this.setState({
        dealerDeck: [data.cards[1]],
        playerDeck: [data.cards[0], data.cards[2]],
        dealerTotal: this.convertValue(data.cards[1].value, this.state.dealerTotal),
        playerTotal: this.convertValue(data.cards[0].value, this.state.playerTotal) + this.convertValue(data.cards[2].value, this.state.playerTotal),
      });

    });
  }

  hit = () => {
    return fetch(`https://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=1`)
    .then(res => res.json())
    .then(data => {

      this.setState(
        {
          playerDeck: [...this.state.playerDeck, data.cards[0]], playerTotal: this.state.playerTotal + this.convertValue(data.cards[0].value, this.state.playerTotal),
          canDouble: false,
        }, () => {

        // Check if user bust
        if (this.state.playerTotal > 21) {
          this.setState({ result: RESULTS[1], bust: 1 }, () => this.rewardPlayer());
        }

      });

    });
  }

  double() {
    this.setState(
    {
      actualBet: this.state.actualBet * 2,
      actualBalance: this.state.actualBalance - this.state.actualBet,
      hasDoubled: true
    }, async () => {
      await this.hit();
      // la vérification du bust du joueur se fait dans hit() et non stand()
      if (this.state.playerTotal <= 21) this.stand();
    });
  }

  async stand() {
    await this.takeCard();

    // Determine a winner
    let result = RESULTS[4];
    let bust = -1;

    if (!this.state.result) {
      const { dealerTotal, playerTotal } = this.state;

      if (dealerTotal > 21 && playerTotal <= 21) {
        result = RESULTS[2];
        bust = 0;
      }
      else if (dealerTotal <= 21 && playerTotal <= 21) {
        if (dealerTotal === playerTotal) {
          result = RESULTS[3];
        }
        else if (dealerTotal < playerTotal) {
          result = RESULTS[2];
        }
        else if (dealerTotal > playerTotal) {
          result = RESULTS[0];
        }
      }
    }

    console.log(result);
    this.setState({ result, bust }, () => this.rewardPlayer());
  }

  async takeCard() {
    // If dealer is under 17, retake card
    while (this.state.dealerTotal < 17) {
      const data = await fetch(`https://deckofcardsapi.com/api/deck/${this.state.deckId}/draw/?count=1`).then(res => res.json());

      this.setState(
        {
          dealerDeck: [...this.state.dealerDeck, data.cards[0]], dealerTotal: this.state.dealerTotal + this.convertValue(data.cards[0].value, this.state.dealerTotal)
        });
    }
  }

  rewardPlayer = () => {
    const { actualBet, actualBalance, result } = this.state;

    if (result) {
      if (result === RESULTS[2]) {

        // If won, pay player
        const gain = actualBet * 2;
        this.setState({ actualBalance: actualBalance + gain, gain });

      } else if (result === RESULTS[3] || result === RESULTS[4]) {

        // If push or error, refund player
        const gain = actualBet;
        this.setState({ actualBalance: actualBalance + gain, gain });

      }
    }
  }

  increaseBet = strBet => {
    const { actualBet, actualBalance, isPlaying } = this.state;
    const bet = (strBet === "All") ? this.state.balance : parseInt(strBet);

    console.log((actualBet + bet), this.canBet(actualBalance, actualBet + bet))

    if (!isPlaying)
      this.setState({
      actualBet: (strBet === "All") ? (actualBet + actualBalance) : (this.canBet(actualBalance, bet) ? actualBet + bet : actualBet),
      actualBalance: (strBet === "All") ? 0 : (this.canBet(actualBalance, bet) ? actualBalance - bet : actualBalance)
    });
  }

  removeBet = () => {
    const { actualBet, actualBalance, isPlaying } = this.state;
    if (!isPlaying)
      this.setState({ actualBet: 0, actualBalance: actualBalance + actualBet });
  }

  // convertValue = (value, actualScore) => ((!isNaN(parseInt(value))) ? parseInt(value) : (value === "ACE") ? ((actualScore + 11) > 21) ? 1 : 11 : 10);

  convertValue(value, actualBet) {
    if (!isNaN(parseInt(value))) {
      return parseInt(value);
    }
    else {
      if (value === "ACE") {
        if ((actualBet + 11) > 21) {
          return 1;
        }
        else {
          return 11;
        }
      }
      else {
        return 10;
      }
    }
  }

  canBet = (actualBet, wantToBet) => ((actualBet - wantToBet) >= 0) ? true : false;


  render() {
    const {
      dealerDeck,
      dealerTotal,
      playerDeck,
      playerTotal,
      actualBet,
      actualBalance,
      result,
      bust,
      gain,
      isPlaying,
      canDouble,
      hasDoubled,
    } = this.state;

    console.log(playerTotal)

    return (isPlaying === 0) ?
        (<BetScreen
            actualBet={ actualBet }
            actualBalance={ actualBalance }
            initGame={ this.initGame }
            increaseBet={ this.increaseBet }
            removeBet={ this.removeBet } />)
      :
        (<GameScreen
            dealerDeck={ dealerDeck }
            dealerTotal={ dealerTotal }
            playerDeck={ playerDeck }
            playerTotal={ playerTotal }
            actualBet={ actualBet }
            actualBalance={ actualBalance }
            result={ result }
            bust={ bust }
            gain={ gain }
            canDouble={ canDouble }
            hasDoubled={ hasDoubled }
            hit={ this.hit }
            double={ this.double }
            stand={ this.stand }
            initGame={ this.initGame }
            canBet={ this.canBet } />);
  }
}

export default App;
