"use client";
import React, {useCallback, useEffect, useState} from "react";
import {fetchData, postData} from "@/app/api";
import {Ranking, Rankings} from "@/app/(default)/mylists/ListCreation";
import TemplatePage from "@/components/Template/TemplatePage";
import Spotlight from "@/components/spotlight";
import TemplateButton from "@/components/Template/TemplateButton";
import {useUserContext} from "@/app/UserProvider";
import {useRouter} from "next/navigation";
import {Button, Stack, Typography} from "@mui/material";
import TemplateInput from "@/components/Template/TemplateInput";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};

interface RankingItem {
    id: number,
    ranking_id: number,
    item_id: number,
    rank: number,
    name: string,
}

interface EditRanking {
    id: number,
    new_rank: number,
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
    const fetchRankings = useCallback(() => {
        fetchData<Rankings>('rankings/' + userId, setRankings).catch(err => setError(err.message));
    }, []);
    useEffect(() => {
        fetchRankings();
    }, [fetchRankings]);

    if (error !== null) {
        console.error(error)
        setError(null);
    }
    const [currentRankingItems, setCurrentRankingItems] = useState<RankingItem[]>([])

    function selectRanking(ranking: Ranking) {
        console.log(currentRanking.id, ranking.id);
        if (currentRanking.id === ranking.id) {
            setCurrentRanking({...ranking, id: 0})
        } else {
            setCurrentRanking({...ranking, id: Number(ranking.id)})
            fetchData('ranking-items/' + ranking.id, setCurrentRankingItems).then(() => console.log('currentItems', currentRankingItems))
        }
    }

    const [editRanking, setEditRanking] = useState<EditRanking[]>([])

    function exchangeRanks(id: number, new_rank: number) {
        const target = currentRankingItems.filter(item => item.rank === new_rank)[0]
        const self = currentRankingItems.filter(item => item.id === id)[0]

        const new_target = {...target, rank: self.rank}
        const new_self = {...self, rank: target.rank}
        const updatedRankingItems = currentRankingItems.map(item => {
            if (item.id === new_target.id) {
                return new_target;
            }
            if (item.id === new_self.id) {
                return new_self;
            }
            return item;
        });
        setCurrentRankingItems(updatedRankingItems);
    }

    function moveRank(id: number, new_rank: number) {
        exchangeRanks(id, new_rank);
        setEditRanking(prevState => {
            return [...prevState, {id, new_rank}]
        })
    }

    async function saveRanking() {
        try {
            await postData<EditRanking[]>('ranking-items', editRanking).then(() => {
                setEditRanking([]);
                fetchRankings();
            });
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    }


    console.log(currentRankingItems)
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
            {currentRanking.id !== 0 && <Stack spacing={1} justifyContent='center'>
				<Spotlight
					className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-6"
				>
                    {currentRankingItems.sort((a, b) => a.rank > b.rank ? 1 : -1)?.map((el, index) => (
                        <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
                            <Typography justifyContent='center' key={index}>{el.name}</Typography>
                            <Typography justifyContent='center' key={index}>{el.rank}</Typography>
                            <TemplateInput label='rank'
                                           type='number'
                                           id={'rank' + index}
                                           key={index}
                                           variant='blue'
                                           placeholder={String(el.rank)}
                                           onBlur={(e) => {
                                               const number_value = Number(e.target.value);
                                               if (number_value <= currentRankingItems.length && number_value !== 0) {
                                                   moveRank(el.id, Number(e.target.value))
                                               }
                                               e.target.value = ''
                                           }}
                            />
                        </div>
                    ))}
				</Spotlight>
				<Button onClick={saveRanking}>Save</Button>
			</Stack>}
        </TemplatePage>
    );
}
