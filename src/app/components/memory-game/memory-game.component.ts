import { Component, OnInit } from '@angular/core';

interface Card {
  id: number;
  image: string;
  matched: boolean;
  flipped: boolean;
}

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.scss'],
  standalone:false
})
export class MemoryGameComponent implements OnInit {
  cards: Card[] = [];
  flippedCards: Card[] = [];
  successMessage = '';

  private logos = [
    'angularjs.png',
    'ionic.svg',
    'tailwind.svg',
    'html.png',
    'css.png',
    'typescript.png',
    'java.png',
    'swift.png'
  ];

  ngOnInit() {
    this.setupGame();
  }

  setupGame() {
    this.successMessage = '';
    const doubleLogos = [...this.logos, ...this.logos];
    const shuffled = doubleLogos
      .map((img, i) => ({ id: i, image: img, matched: false, flipped: false }))
      .sort(() => 0.5 - Math.random());

    this.cards = shuffled;
    this.flippedCards = [];
  }

  flipCard(card: Card) {
    if (card.flipped || card.matched || this.flippedCards.length === 2) return;

    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      const [first, second] = this.flippedCards;
      if (first.image === second.image) {
        first.matched = true;
        second.matched = true;
        this.flippedCards = [];

        if (this.cards.every(c => c.matched)) {
          this.successMessage = '¡Enhorabuena! Has emparejado todos los logos 🎉';
        }
      } else {
        setTimeout(() => {
          first.flipped = false;
          second.flipped = false;
          this.flippedCards = [];
        }, 1000);
      }
    }
  }

  restart() {
    this.setupGame();
  }
}
