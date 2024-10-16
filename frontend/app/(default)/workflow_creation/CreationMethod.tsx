"use client";
import TemplatePage from "@/components/Template/TemplatePage";
import Spotlight from "@/components/spotlight";
import TemplateCard from "@/components/Template/TemplateCard";
import TournoiImg from "@/public/images/tournoi.png";
import TierList from "@/public/images/tier_list.png";
import {RankingProps} from "@/app/(default)/workflow_creation/WorkflowCreation";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};

const rankingCard = [
    {
        title: 'Tournoi',
        image: TournoiImg,
        description: ''
    },
    {
        title: 'Tier List',
        image: TierList,
        description: ''
    },
    {
        title: 'Numbered',
        image: TierList,
        description: ''
    },
    {
        title: 'Pyramid',
        image: TierList,
        description: ''
    },
    {
        title: 'Points',
        image: TierList,
        description: ''
    }
]

export default function CreationMethod({setNewRanking}: RankingProps) {


    return (
        <TemplatePage
            title="Step 3 : Creation Method"
            description="Select a ranking method."
        >
            <Spotlight
                className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">
                {rankingCard.map((card, i) => (
                    <TemplateCard key={i} title={card.title} image={card.image} description={card.description}/>
                ))}
            </Spotlight>
        </TemplatePage>
    );
}
