"use client";
import Spotlight from "@/components/spotlight";
import TemplateCard from "@/components/Template/TemplateCard";
import TournoiImg from "@/public/images/Tournoi.jpg";
import TierList from "@/public/images/tier_list.png";
import Podium from "@/public/images/podium.webp";
import TemplatePage from "@/components/Template/TemplatePage";
import {NewRanking, RankingProps} from "@/app/(default)/workflow_creation/WorkflowCreation";
import {smoothScrollToElement} from "@/app/utils";


const rankingCard = [
    {
        title: 'Tournoi',
        image: TournoiImg,
        description: '',
        key: 'tournament',
        disabled: true
    },
    {
        title: 'Tier List',
        image: TierList,
        description: '',
        key: 'tier_list',
        disabled: true
    },
    {
        title: 'Classique',
        image: Podium,
        description: '',
        key: 'numbered'
    },
    {
        title: 'Pyramid',
        image: "",
        description: '',
        key: 'pyramid',
        disabled: true
    },
    {
        title: 'Points',
        image: "",
        description: '',
        key: 'points',
        disabled: true
    }
]

export default function DisplaySelection({newRanking, setNewRanking}: RankingProps) {

    function onClick(card: any) {
        smoothScrollToElement('step3');
        setNewRanking((prevValue: NewRanking) => {
            return {
                ...prevValue,
                ranking_type: card.key,
            }
        })
    }

    return (
        <TemplatePage
            id="step2"
            title="Step 2 : Display Selection"
            description="Select how you want your ranking to be displayed."
        >
            <Spotlight
                className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-5">
                {rankingCard.map((card, i) => (
                    <TemplateCard
                        disabled={card.disabled}
                        selected={newRanking.ranking_type === card.key}
                        onClick={() => onClick(card)}
                        key={i}
                        title={card.title}
                        image={card.image}
                        description={card.description}
                    />
                ))}
            </Spotlight>
        </TemplatePage>
    );
}
