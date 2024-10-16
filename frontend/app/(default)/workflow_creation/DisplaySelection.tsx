"use client";
import Spotlight from "@/components/spotlight";
import TemplateCard from "@/components/Template/TemplateCard";
import TournoiImg from "@/public/images/tournoi.png";
import TierList from "@/public/images/tier_list.png";
import TemplatePage from "@/components/Template/TemplatePage";
import {NewRanking, RankingProps} from "@/app/(default)/workflow_creation/WorkflowCreation";


const rankingCard = [
    {
        title: 'Tournoi',
        image: TournoiImg,
        description: '',
        key: 'tournament'
    },
    {
        title: 'Tier List',
        image: TierList,
        description: '',
        key: 'tier_list'
    },
    {
        title: 'Numbered',
        image: TierList,
        description: '',
        key: 'numbered'
    },
    {
        title: 'Pyramid',
        image: TierList,
        description: '',
        key: 'pyramid'
    },
    {
        title: 'Points',
        image: TierList,
        description: '',
        key: 'points'
    }
]

export default function DisplaySelection({setNewRanking}: RankingProps) {


    return (
        <TemplatePage
            title="Step 2 : Display Selection"
            description="Select how you want your ranking to be displayed."
        >
            <Spotlight
                className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">
                {rankingCard.map((card, i) => (
                    <TemplateCard onClick={() => setNewRanking((prevValue: NewRanking) => {
                        return {
                            ...prevValue,
                            ranking_type: card.key,
                        }
                    })} key={i} title={card.title} image={card.image}
                                  description={card.description}/>
                ))}
            </Spotlight>
        </TemplatePage>
    );
}
