import {RankingItem} from "@/components/Models/ModelRankings";

export interface Item {
    list_id?: number;
    id: number;
    name: string;
    image?: string;
}

export interface InputItem {
    name: string;
    image?: string;
}

export interface ComponentProps {
    currentRankingItems: RankingItem[];
    setCurrentRankingItems: (currentRankingItems: RankingItem[]) => void;
    ranking_id: number;
}


export interface NewList {
    user_id: number | null;
    name: string;
    items: InputItem[];
}

export interface ListDb {
    user_id: number | null;
    name: string;
    list_id: number;
}

export type Lists = ListDb[];


export interface Ranking {
    id: number;
    user_id: number | null;
    name: string;
    ranking_type: "numbered" | "tier_list" | "tournament";
    creation_method: "manual" | "intelligent_dual";
    list_id: number;
}

export type Rankings = Ranking[]