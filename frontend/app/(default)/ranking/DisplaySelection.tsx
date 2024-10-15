"use client";
import Spotlight from "@/components/spotlight";
import TemplateCard from "@/components/Template/TemplateCard";
import TournoiImg from "@/public/images/tournoi.png";
import TierList from "@/public/images/tier_list.png";
import TemplatePage from "@/components/Template/TemplatePage";

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

export default function DisplaySelection() {


    return (
        <TemplatePage
            title="Step 2 : Display Selection"
            description="Select how you want your ranking to be displayed."
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
