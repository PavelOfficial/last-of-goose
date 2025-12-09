import { Card, Spin } from "antd"
import { useParams } from "react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

import goose from '../../../assets/goose.jpeg'
import "./styles.css";
import { authGuard } from "../../authGuard";
import { useRoundItemQuery, useRoundTapMutation } from "query/api/appApi.api";

import type { EnhancedRoundInfo, RoundMode, Stats, TopStat } from "domain/Rounds";
import { UserName } from "../../Shared/UserName";
import { leadingZeros } from "../../../libs/leadingZeros";


const roundModeCaptions = {
    cooldown: "Cooldown",  
    rounds: "Раунды", 
    finished: "Раунд завершен", 
};


const useCooldownTime = (roundMode: RoundMode, timingMode: RoundMode, startTime:number) => {
    const [delta, setDelta] = useState(startTime - Date.now())
    const result = useMemo(() => {
        if (roundMode === timingMode) {
            const seconds = Math.floor((startTime - Date.now()) / 1000)
            const minutes = Math.floor(seconds / 60);

            return `${leadingZeros(minutes, 2)}:${leadingZeros(seconds, 2)}`
        }

        return "";
    }, [roundMode, delta]);

    useEffect(() => {
        const refreshDelta = () => {
            const delta = startTime - Date.now();
            const microsecondsRest = delta % 1000;
            setDelta(delta);
            if (delta > 0) {
                setTimeout(refreshDelta, microsecondsRest);
            }
        }   
        
        refreshDelta();
    }, [])
    
    return result;
}
    
interface Props {
    roundItem: EnhancedRoundInfo,
    onRefetchData: () => void,
}

export const PageRoundItemContent = ({ roundItem, onRefetchData }: Props) => {
    const startTime = useMemo(() => new Date(roundItem.round.startTime).getTime(), []);
    const endTime = useMemo(() => new Date(roundItem.round.endTime).getTime(), []);
    const now = useRef(Date.now())
    const getRoundMode = useCallback<() => RoundMode>(() => {
        now.current = Date.now();

        if (now.current > endTime) {
            return "finished";
        }

        if (now.current < startTime) {
            return "cooldown";
        }

        return "rounds";
    }, []);

    const [roundMode, setRoundMode] = useState<RoundMode>(getRoundMode()); 

    useEffect(() => {
        const updateCaption = () => {
            const roundMode = getRoundMode()
            setRoundMode(roundMode);
            
            if (roundMode === "cooldown") {
                const delta = startTime - now.current;
                setTimeout(updateCaption, delta);
            }

            if (roundMode === "rounds") {
                const delta = endTime - now.current;
                setTimeout(updateCaption, delta);
            }

            if (roundMode === "finished") {
                onRefetchData()
            }
        }

        updateCaption();        
    }, [])

    const [roundTapMutation] = useRoundTapMutation()
    const [myStat, setMyStat] = useState<Stats|null>(null);
    
    const handleTapOnGoose = async () => {
        const now = Date.now();

        if (now > startTime && now < endTime) {
            try {
                const response = await roundTapMutation(roundItem.round.id);

                setMyStat(response.data!);
                console.log("response: ", response);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const caption = roundModeCaptions[roundMode];
    const cooldownTime = useCooldownTime(roundMode, "cooldown", startTime);
    const roundCooldownTime = useCooldownTime(roundMode, "rounds", endTime);

    const findWinner = (topStats: TopStat[]) => {
        let usename: string | null = null;
        let maxScore:number | null = null;
        topStats.forEach((topStat) => {
            if (maxScore === null || topStat.score > maxScore) {
                maxScore = topStat.score
                usename = topStat.user.username
            }
        })

        return usename;
    }

    return (
        <Card title={caption} 
            extra={<UserName />} 
            style={{ maxWidth: "850px", minWidth: "550px" }}>
            <img src={goose} onClick={handleTapOnGoose} alt="goose" height="320px" width="320px" />
            {roundMode === "cooldown" &&    
                <div className="bottom-caption">
                    <div>Cooldown</div><div>До начала раунда: {cooldownTime}</div>
                </div>
            }
            {roundMode === "rounds" &&    
                <div className="bottom-caption">
                    <div>Раунд активен!</div>
                    <div>До окончания раунда: {roundCooldownTime}</div>
                    <div>Мои очки: {myStat != null ? myStat.score : roundItem.myStats.score}</div>
                </div>
            }
            {roundMode === "finished" &&  
                <div className="bottom-caption">
                    <div>Всего: {roundItem.topStats.reduce((result, item) => { return result + item.score }, 0)}</div>
                    <div>Победитель: {findWinner(roundItem.topStats)}</div>
                    <div>Мои очки: {myStat != null ? myStat.score : roundItem.myStats.score}</div>
                </div>
            }   
        </Card>
    )
}

export const PageRoundItemBase = () => {
    const { id }= useParams();
    const { data: roundItem, refetch } = useRoundItemQuery(id!);

    
    // const { data: rounds } = useRoundsQuery();
    // const [mutationCreateRound] = useCreateRoundMutation();
    // const navigate = useNavigate();

    if (!roundItem) { //  || !rounds
        return <div><Spin /></div>
    }    

    return (
        <PageRoundItemContent roundItem={roundItem} onRefetchData={refetch}  />
    );
}


const PageRoundItem = authGuard(PageRoundItemBase);

export default PageRoundItem;