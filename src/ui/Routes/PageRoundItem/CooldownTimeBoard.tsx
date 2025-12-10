import type { RoundMode } from "domain/Rounds";

import { useCooldownTime } from "./useCooldownTime";

interface Props {
    startTime: number
    roundMode: RoundMode
}

export const CooldownTimeBoard = ({ startTime, roundMode }: Props) => {
    const cooldownTime = useCooldownTime(roundMode, "cooldown", startTime);

    return (
        <div className="bottom-caption">
            <div>Cooldown</div><div>До начала раунда: {cooldownTime}</div>
        </div>
    );
}
