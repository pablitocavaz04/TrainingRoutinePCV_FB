import { Component, HostListener, OnInit } from '@angular/core';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-snake-game',
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.scss'],
  standalone:false
})
export class SnakeGameComponent implements OnInit {
  boardSize = 6;
  cells: { x: number; y: number }[] = [];
  snake: Point[] = [{ x: 2, y: 2 }];
  food: Point = { x: 4, y: 4 };
  direction: Point = { x: 0, y: 0 };
  gameOver = false;
  gameStarted = false;
  waitingForDirection = false;
  score = 0;
  funnyMessage = '';
  intervalId: any;
  victory = false;
  maxScore = 10; 

  // 🔥 Sonidos
  eatSound = new Audio('assets/sounds/244656__dsg__pop-6.mp3');
  gameOverSound = new Audio('assets/sounds/767605__minimalistiga__gameover-sfx.mp3');

  funnyMessages = [
    'Se te da regular este juego',
    '¡Inténtalo otra vez, maquina!',
    'Lo tuyo no es el Snake Game...',
    '¡Esta serpiente todavía esta muerta de hambre!',
    '¿Seguro que has jugado alguna vez al Snake Game?',
    'Yo si fuese tu, dejaba de intentarlo'
  ];

  ngOnInit() {
    this.generateCells();
  }

  generateCells() {
    this.cells = [];
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        this.cells.push({ x, y });
      }
    }
  }

  startGame() {
    this.victory = false;
    this.generateCells();
    this.snake = [{ x: 2, y: 2 }];
    this.food = this.randomFood();
    this.direction = { x: 0, y: 0 };
    this.gameOver = false;
    this.funnyMessage = '';
    this.gameStarted = true;
    this.waitingForDirection = true;
    this.score = 0;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = null;
  }

  randomFood(): Point {
    return {
      x: Math.floor(Math.random() * this.boardSize),
      y: Math.floor(Math.random() * this.boardSize)
    };
  }

  moveSnake() {
    if (this.gameOver) return;

    const newHead: Point = {
      x: this.snake[0].x + this.direction.x,
      y: this.snake[0].y + this.direction.y
    };

    if (this.isCollision(newHead)) {
      this.gameOver = true;
      this.funnyMessage = this.funnyMessages[Math.floor(Math.random() * this.funnyMessages.length)];
      this.gameOverSound.play(); // 🔥 Sonido de muerte
      clearInterval(this.intervalId);
      return;
    }

    this.snake.unshift(newHead);

    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.food = this.randomFood();
      this.score++;
      this.eatSound.play();
    
      // ✅ Comprobamos si ha ganado
      if (this.score >= this.maxScore) {
        this.victory = true;
        this.funnyMessage = '¡Victoriaaaa!';
        clearInterval(this.intervalId);
        return;
      }
    }
    else {
      this.snake.pop();
    }
  }

  isCollision(point: Point): boolean {
    return (
      point.x < 0 ||
      point.x >= this.boardSize ||
      point.y < 0 ||
      point.y >= this.boardSize ||
      this.snake.some(segment => segment.x === point.x && segment.y === point.y)
    );
  }

  getCellClass(cell: { x: number; y: number }): string {
    if (this.snake.some(s => s && s.x === cell.x && s.y === cell.y)) {
      return 'bg-green-500';
    } else if (this.food && this.food.x === cell.x && this.food.y === cell.y) {
      return 'bg-red-500';
    } else {
      return 'bg-gray-200';
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (!this.gameStarted || this.gameOver) return;

    let newDirection: Point | null = null;

    switch (event.key.toLowerCase()) {
      case 'w':
        if (this.direction.y === 0) newDirection = { x: 0, y: -1 };
        break;
      case 's':
        if (this.direction.y === 0) newDirection = { x: 0, y: 1 };
        break;
      case 'a':
        if (this.direction.x === 0) newDirection = { x: -1, y: 0 };
        break;
      case 'd':
        if (this.direction.x === 0) newDirection = { x: 1, y: 0 };
        break;
    }

    if (newDirection) {
      this.direction = newDirection;

      if (this.waitingForDirection) {
        this.waitingForDirection = false;
        this.intervalId = setInterval(() => this.moveSnake(), 200);
      }
    }
  }
}
