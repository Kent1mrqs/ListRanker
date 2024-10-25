"use client";
import TemplatePage from "@/components/Template/TemplatePage";
import Spotlight from "@/components/spotlight";
import TemplateCard from "@/components/Template/TemplateCard";
import TournoiImg from "@/public/images/Tournoi.jpg";
import DuelsImg from "@/public/images/Duels.webp";
import ManualExchange from "@/public/images/ManualExchange.png";
import {smoothScrollToElement} from "@/app/utils";
import {NewRanking, RankingProps} from "@/components/Models/ModelRankings";

const rankingCard = [
    {
        title: 'Manual',
        image: ManualExchange,
        description: 'Make your ranking entirely by yourself',
        key: 'manual'
    },
    {
        title: 'Tournament',
        image: TournoiImg,
        description: 'Generate a tournament and find your champion !',
        key: 'tournament',
        disabled: true
    },
    {
        title: 'Dual match',
        image: DuelsImg,
        description: 'Generate dual matches to find your total ranking',
        key: 'duels',
    }
]

export default function CreationMethod({newRanking, setNewRanking}: RankingProps) {

    function onClick(card: any) {
        smoothScrollToElement('step4');
        setNewRanking((prevValue: NewRanking) => {
            return {
                ...prevValue,
                creation_method: card.key,
            }
        })

    }

    return (
        <TemplatePage
            id="step3"
            title="Step 3 : Creation Method"
            description="Select a ranking method."
        >
            <Spotlight
                className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">
                {rankingCard.map((card, i) => (
                    <TemplateCard
                        selected={newRanking.creation_method === card.key}
                        key={i} heightImageMax="h-[300px]"
                        disabled={card.disabled}
                        title={card.title}
                        image={card.image}
                        description={card.description}
                        onClick={() => onClick(card)}
                    />
                ))}
            </Spotlight>
        </TemplatePage>
    );
}
