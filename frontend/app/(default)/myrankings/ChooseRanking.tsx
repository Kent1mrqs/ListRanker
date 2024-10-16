"use client";
import {useCallback, useEffect, useState} from "react";
import {fetchData} from "@/app/api";
import {Rankings} from "@/app/(default)/mylists/ListCreation";
import TemplatePage from "@/components/Template/TemplatePage";
import Spotlight from "@/components/spotlight";
import TemplateButton from "@/components/Template/TemplateButton";
import TemplateLink from "@/components/Template/TemplateLink";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};


export default function ChooseRanking() {
    const [currentRankingId, setCurrentRankingId] = useState<number>(0)
    const [error, setError] = useState<string | null>(null);
    const [rankings, setRankings] = useState<Rankings>([]);
    const fetchLists = useCallback(() => {
        fetchData<Rankings>('rankings', setRankings).catch(err => setError(err.message));
    }, []);
    useEffect(() => {
        fetchLists();
    }, [fetchLists]);

    if (error !== null) {
        console.error(error)
        setError(null);
    }

    function selectRanking(id: number) {
        if (id === currentRankingId) {
            setCurrentRankingId(0)
        } else {
            setCurrentRankingId(id)
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
                                    variant={ra.id === currentRankingId ? "grey" : "blue"}
                                    onClick={() => selectRanking(Number(ra.id))}
                    />
                ))}
                <TemplateLink text='New Ranking'
                              variant='outlined'
                              route=''
                />
            </Spotlight>
        </TemplatePage>
    );
}
