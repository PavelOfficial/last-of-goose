import type { EnhancedRoundInfo, RoundMode, Stats } from "domain/Rounds";

import { useCooldownTime } from "./useCooldownTime";

interface Props {
    roundMode: RoundMode,
    endTime: number,
    myStat: Stats | null,
    roundItem: EnhancedRoundInfo
};

export const RoundsBoard = ({ roundMode, endTime, myStat, roundItem }: Props) => {
    const roundCooldownTime = useCooldownTime(roundMode, "rounds", endTime);

    return (
        <div className="bottom-caption">
            <div>Раунд активен!</div>
            <div>До окончания раунда: {roundCooldownTime}</div>
            <div>Мои очки: {myStat != null ? myStat.score : roundItem.myStats.score}</div>
        </div>
    );
}