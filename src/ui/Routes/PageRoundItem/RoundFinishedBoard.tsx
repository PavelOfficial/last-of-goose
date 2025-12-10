import type { EnhancedRoundInfo, Stats } from "domain/Rounds";
import { useMemo } from "react";

interface Props {
    myStat: Stats | null,
    roundItem: EnhancedRoundInfo
}

export const RoundFinishedBoard = ({ myStat, roundItem }: Props) => {
     const winner = useMemo(() => {
        let usename: string | null = null;
        let maxScore:number | null = null;
        roundItem.topStats.forEach((topStat) => {
            if (maxScore === null || topStat.score > maxScore) {
                maxScore = topStat.score
                usename = topStat.user.username
            }
        })

        return usename;
    }, [roundItem]);

    const allScores = useMemo(() => {
        return roundItem.topStats.reduce((result, item) => { return result + item.score }, 0)
    }, [roundItem])

    return (
        <dl className="bottom-caption-results">
            <dt>Всего:</dt><dd>{allScores}</dd>
            <dt>Победитель:</dt><dd>{winner}</dd>
            <dt>Мои очки:</dt><dd>{myStat != null ? myStat.score : roundItem.myStats.score}</dd>
        </dl>
    );
}