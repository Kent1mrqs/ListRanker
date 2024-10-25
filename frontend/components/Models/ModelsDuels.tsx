import {Item} from "@/components/Models/ModelsItems";

export interface DuelResponse {
    next_duel: Item[];
    duels_left: number
}

export interface NextDuelData {
    NextDuelData: DuelResponse
}

export const default_duel = [{
    id: 0,
    name: "",
    image: ''
}, {
    id: 0,
    name: "",
    image: ""
}];


export interface BattleResult {
    ranking_id: number;
    loser: number;
    winner: number;
}

export interface DuelProps {
    currentDual: Item[];
    duelsLeft: number;
    resetDuel: () => void;
    chooseCard: (winner: BattleResult) => void;
    ranking_id: number;
}