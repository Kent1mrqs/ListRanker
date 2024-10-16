"use client";
import {useCallback, useEffect, useState} from "react";
import {fetchData} from "@/app/api";
import {Item, Ranking, Rankings} from "@/app/(default)/mylists/ListCreation";
import TemplatePage from "@/components/Template/TemplatePage";
import Spotlight from "@/components/spotlight";
import TemplateButton from "@/components/Template/TemplateButton";
import {useUserContext} from "@/app/UserProvider";
import {useRouter} from "next/navigation";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};

interface rankprops {
    currentRanking: Ranking;
    setCurrentRanking: (ranking: Ranking) => void;
}


export default function ChooseRanking() {
    const {userId} = useUserContext();
    const default_ranking: Ranking = {
        id: 0,
        user_id: userId,
        name: "",
        ranking_type: "",
        list_id: 0
    }
    const router = useRouter();
    const [currentRanking, setCurrentRanking] = useState<Ranking>(default_ranking)
    const [error, setError] = useState<string | null>(null);
    const [rankings, setRankings] = useState<Rankings>([]);
    const fetchLists = useCallback(() => {
        fetchData<Rankings>('rankings/' + userId, setRankings).catch(err => setError(err.message));
    }, []);
    useEffect(() => {
        fetchLists();
    }, [fetchLists]);

    if (error !== null) {
        console.error(error)
        setError(null);
    }
    const [currentItems, setCurrentItems] = useState<Item[]>([])

    function selectRanking(ranking: Ranking) {
        console.log(currentRanking.id, ranking.id);
        if (currentRanking.id === ranking.id) {
            setCurrentRanking({...ranking, id: 0})
        } else {
            setCurrentRanking({...ranking, id: Number(ranking.id)})
            fetchData('items/' + ranking.list_id, setCurrentItems).then(() => console.log('currentItems', currentItems))
        }
    }

    return (
        <TemplatePage
            title="My Rankings"
            description=" "
        >
            <Spotlight
                className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-6"
            >
                {rankings.map((ra, index) => (
                    <TemplateButton key={index}
                                    text={ra.name}
                                    variant={ra.id === currentRanking.id ? "grey" : "blue"}
                                    onClick={() => selectRanking(ra)}
                    />
                ))}
                <TemplateButton text='New Ranking'
                                variant='outlined'
                                onClick={() => router.push('/')}
                />
            </Spotlight>
        </TemplatePage>
    );
}
