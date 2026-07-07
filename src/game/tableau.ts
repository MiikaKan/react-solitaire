import  { Card, isOneRankLower, isRedSuit } from './cards';

export type Tableau = Card[][];

export function canPlaceCardOnTableau(tableau: Tableau, card: Card, columnIndex: number): boolean {
    if(columnIndex < 0 || columnIndex >= tableau.length) {
        return false;
    }

    const column = tableau[columnIndex];

    // if the column is empty, only a King can be placed
    if(column.length === 0) {
        return card.rank === 'K';
    }

    const topCard = column[column.length - 1];

    // check if the card can be placed on top of the column
    return isOneRankLower(card, topCard) && isRedSuit(card) !== isRedSuit(topCard);
}