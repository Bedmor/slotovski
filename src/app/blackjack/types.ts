export type Card = {
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  value:
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10"
    | "J"
    | "Q"
    | "K"
    | "A";
  display: string;
};

export type Player = {
  id: string;
  name: string;
  hand: Card[];
  bet: number;
  credits: number;
  stand: boolean;
  busted: boolean;
  blackjack: boolean;
};

export type GameRoom = {
  id: string;
  players: Player[];
  dealer: {
    hand: Card[];
    busted: boolean;
  };
  deck: Card[];
  currentPlayerIndex: number;
  gameStarted: boolean;
  gameEnded: boolean;
  createdAt: number;
  maxPlayers: number;
};
