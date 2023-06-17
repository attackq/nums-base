export interface Number {
  id: string;
  data: [
    {
      title: string;
      id: number;
      product: string;
      creatorName: string;
      createdAt: number;
    }
  ];
}

export interface CardNumber {
  title: string;
  id: number;
  product: string;
  creatorName: string;
  createdAt: number;
}

export interface Card {
  id: string;
  data: CardNumber[];
}
