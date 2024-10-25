import {Ranking} from "@/components/Models/ModelsItems";

export interface RankingItem {
    id: number,
    ranking_id: number,
    item_id: number,
    rank: number,
    name: string,
    score: number,
}

export interface NewRanking {
    creation_method: string;
    user_id: number | null;
    name: string;
    ranking_type: string;
    list_id: number;
}


export type RankingProps = {
    newRanking: {
        creation_method: string;
        user_id: number | null;
        list_id: number;
        name: string;
        ranking_type: string
    },
    setNewRanking: (newValue: (prevValue: NewRanking) => {
        user_id: number | null;
        creation_method: string;
        list_id: number;
        name: string;
        ranking_type: string
    }) => void;
}

export interface EditRanking {
    id: number,
    new_rank: number,
}

export interface ChooseRankingProps {
    currentRanking: Ranking,
    setCurrentRanking: (currentRanking: Ranking) => void,
    setCurrentRankingItems: (currentRankingItems: RankingItem[]) => void,
}