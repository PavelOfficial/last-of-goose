import { Card, Spin } from "antd"
import { useParams } from "react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

import goose from '../../../assets/goose.jpeg'
import "./styles.css";
import { authGuard } from "../../authGuard";
import { useRoundItemQuery } from "query/api/appApi.api";

import type { EnhancedRoundInfo, RoundMode } from "domain/Rounds";
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

    const caption = roundModeCaptions[roundMode];
    const cooldownTime = useCooldownTime(roundMode, "cooldown", startTime);
    const roundCooldownTime = useCooldownTime(roundMode, "rounds", endTime);

    return (
        <Card title={caption} 
            extra={<UserName />} 
            style={{ maxWidth: "850px", minWidth: "550px" }}>
            <img src={goose} alt="goose" height="320px" width="320px" />
            {JSON.stringify(roundItem)}
            {roundMode === "cooldown" &&    
                <div className="bottom-caption">
                    <div>Cooldown</div><div>До начала раунда: {cooldownTime}</div>
                </div>
            }
            {roundMode === "rounds" &&    
                <div className="bottom-caption">
                    <div>Раунд активен!</div>
                    <div>До окончания раунда: {roundCooldownTime}</div>
                    <div>Мои очки: 100</div>
                </div>
            }
            {roundMode === "finished" &&  
                <div className="bottom-caption">
                    <div>Всего</div>
                    <div>Победитель</div>
                    <div>Мои очки</div>
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