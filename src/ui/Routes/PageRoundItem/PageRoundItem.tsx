import { Card, Spin } from "antd"
import { useParams } from "react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

import goose from '../../../assets/goose.jpeg'
import "./styles.css";
import { authGuard } from "../../authGuard";
import { useRoundItemQuery } from "query/api/appApi.api";

import type { EnhancedRoundInfo } from "domain/Rounds";
import { UserName } from "../../Shared/UserName";

const leadingZeros = (value: number, digitCount: number) => {
    return `00000000000${value}`.slice(-digitCount);
}

type RoundMode = "cooldown" | "rounds" | "finished"

const roundModeCaptions = {
    cooldown: "Cooldown",  
    rounds: "Раунды", 
    finished: "Раунд завершен", 
};
    
interface Props {
    roundItem: EnhancedRoundInfo
}

const useCooldownTime = (roundMode: RoundMode, startTime:number) => {
    const [delta, setDelta] = useState(startTime - Date.now())
    const result = useMemo(() => {
        if (roundMode === "cooldown") {
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

export const PageRoundItemContent = ({ roundItem }: Props) => {
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
        }

        updateCaption();        
    }, [])

    const caption = roundModeCaptions[roundMode];
    const cooldownTime = useCooldownTime(roundMode, startTime);

    return (
        <Card title={caption} 
            extra={<UserName />} 
            style={{ maxWidth: "850px", minWidth: "550px" }}>
            <img src={goose} alt="goose" height="320px" width="320px" />
            {/*JSON.stringify(roundItem)*/}
            {roundMode === "cooldown" &&    
                <div className="bottom-caption">
                    <div>Cooldown</div><div>До начала раунда: {cooldownTime}</div>
                </div>
            }
        </Card>
    )
}

export const PageRoundItemBase = () => {
    const { id }= useParams();
    const { data: roundItem } = useRoundItemQuery(id!);

    
    // const { data: rounds } = useRoundsQuery();
    // const [mutationCreateRound] = useCreateRoundMutation();
    // const navigate = useNavigate();

    if (!roundItem) { //  || !rounds
        return <div><Spin /></div>
    }    

    return (
        <PageRoundItemContent roundItem={roundItem}  />
    );
}


const PageRoundItem = authGuard(PageRoundItemBase);

export default PageRoundItem;