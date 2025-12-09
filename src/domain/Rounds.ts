export interface Round {
    "id": string,
    "startTime": string,
    "endTime": string,
    "totalScore": number,
    "createdAt": string,
}

export interface TopStat {
    taps: number,
    score: number,
    user: {
        username: string
    }
}

export interface Stats {
  "taps": 0,
  "score": 0
}

export interface EnhancedRoundInfo {
    round: Round,
    topStats: TopStat[],
    myStats: Stats,
}




export type RoundMode = "cooldown" | "rounds" | "finished"