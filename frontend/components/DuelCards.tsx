import Spotlight from "@/components/spotlight";
import {TemplateDuelCard} from "@/components/Template/TemplateCard";
import TemplateButton from "@/components/Template/TemplateButton";
import React from "react";
import {BattleResult} from "@/components/Models/ModelsDuels";
import {Item} from "@/components/Models/ModelsItems";

interface DuelProps {
    currentDual: Item[];
    duelsLeft: number;
    resetDuel: () => void;
    chooseCard: (winner: BattleResult) => void;
    ranking_id: number;
}

export function Duel({currentDual, resetDuel, chooseCard, ranking_id, duelsLeft}: DuelProps) {
    return (
        <Spotlight
            className="group mx-auto grid max-w-sm mt-3 items-start justify-center gap-6 lg:max-w-none lg:grid-cols-3 h-auto">
            <div className="flex justify-center">
                <TemplateDuelCard title={currentDual[0].name}
                                  image={currentDual[0].image}
                                  variant="duel"
                                  onClick={() => chooseCard({
                                      ranking_id,
                                      winner: currentDual[0].id,
                                      loser: currentDual[1].id
                                  })}/>
            </div>
            <div
                className="flex justify-center items-center relative z-20 h-full overflow-hidden rounded-[inherit]"
            >
                <div>
                    <div>Duels left: {duelsLeft}</div>
                    <TemplateButton text="Reset" onClick={resetDuel}/>
                </div>

            </div>

            <div className="flex justify-center">
                <TemplateDuelCard title={currentDual[1].name}
                                  image={currentDual[1].image}
                                  variant="duel"
                                  onClick={() => chooseCard({
                                      ranking_id,
                                      winner: currentDual[1].id,
                                      loser: currentDual[0].id
                                  })}/>
            </div>
        </Spotlight>
    )
}
