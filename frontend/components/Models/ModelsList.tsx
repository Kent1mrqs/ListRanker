import {InputItem} from "@/components/Models/ModelsItems";

export type ListProps = {
    currentList: List;
    setCurrentList: (list: List) => void;
};

export type ListItems = {
    name: string,
    id: number,
    items: InputItem[]
}

export interface List {
    name: string;
    id: number;
}