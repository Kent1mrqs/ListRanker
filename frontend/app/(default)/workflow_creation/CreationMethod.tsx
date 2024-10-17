"use client";
import TemplatePage from "@/components/Template/TemplatePage";
import Spotlight from "@/components/spotlight";
import TemplateCard from "@/components/Template/TemplateCard";
import TournoiImg from "@/public/images/tournoi.png";
import TierList from "@/public/images/tier_list.png";
import {NewRanking, RankingProps} from "@/app/(default)/workflow_creation/WorkflowCreation";

const rankingCard = [
    {
        title: 'Manual',
        image: TournoiImg,
        description: 'Make your ranking entirely by yourself',
        key: 'manual'
    },
    {
        title: 'Tournament',
        image: TierList,
        description: 'Generate a tournament and find your champion !',
        key: 'tournament',
        disabled: true
    },
    {
        title: 'Dual match',
        image: TierList,
        description: 'Generate dual matches to find your total ranking',
        key: 'intelligent_dual',
    }
]

export default function CreationMethod({newRanking, setNewRanking}: RankingProps) {
    return (
        <TemplatePage
            title="Step 3 : Creation Method"
            description="Select a ranking method."
        >
            <Spotlight
                className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">
                {rankingCard.map((card, i) => (
                    <TemplateCard
                        selected={newRanking.method_creation === card.key}
                        key={i}
                        disabled={card.disabled}
                        title={card.title}
                        image={card.image}
                        description={card.description}
                        onClick={() => setNewRanking((prevValue: NewRanking) => {
                            return {
                                ...prevValue,
                                method_creation: card.key,
                            }
                        })}
                    />
                ))}
            </Spotlight>
        </TemplatePage>
    );
}
