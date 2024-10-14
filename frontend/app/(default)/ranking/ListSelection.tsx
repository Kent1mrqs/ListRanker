import Spotlight from "@/components/spotlight";
import Card from "@/components/Card";
import TournoiImg from "@/public/images/tournoi.png";
import TierList from "@/public/images/tier_list.png";

export const metadata = {
    title: "Home - Open PRO",
    description: "Page description",
};

const rankingCard = [
    {
        title: 'tournoi',
        image: TournoiImg,
        description: ''
    },
    {
        title: 'tierlist',
        image: TierList,
        description: ''
    }
]


export default function ListSelection() {

    return (
        <section>
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="pb-12 md:pb-20">
                    {/* Section header */}
                    <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
                        <div
                            className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50">
                        </div>
                        <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
                            Ranking
                        </h2>
                        <p className="text-lg text-indigo-200/65">
                            Simple and elegant interface to start collaborating with your team
                            in minutes. It seamlessly integrates with your code and your
                            favorite programming languages.
                        </p>
                    </div>
                    {/* Spotlight items */}
                    <Spotlight className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">
                        {rankingCard.map((card, i) => (
                            <Card key={i} title={card.title} image={card.image} description={card.description}/>
                        ))}
                    </Spotlight>
                </div>
            </div>
        </section>
    );
}
