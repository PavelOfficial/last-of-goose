export interface Round {
    "id": string,
    "startTime": string,
    "endTime": string,
    "totalScore": number,
    "createdAt": string,
}

interface TopStat {
    taps: number,
    score: number,
    user: {
        username: string
    }
}

export interface EnhancedRoundInfo {
    round: Round,
    topStats: TopStat[],
    myStats: {
        taps: number,
        score: number,
    },
}


export type RoundMode = "cooldown" | "rounds" | "finished"