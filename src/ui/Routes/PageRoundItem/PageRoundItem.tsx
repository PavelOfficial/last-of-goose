import { Card, Divider, Spin } from "antd"
import { useParams } from "react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";

import goose from 'assets/goose.jpeg'
import "./styles.css";
import { authGuard } from "../../authGuard";
import { useRoundItemQuery, useRoundTapMutation } from "query/api/appApi.api";

import type { EnhancedRoundInfo, RoundMode, Stats } from "domain/Rounds";
import { UserName } from "../../Shared/UserName";
import { CooldownTimeBoard } from "./CooldownTimeBoard";
import { RoundsBoard } from "./RoundsBoard";
import { RoundFinishedBoard } from "./RoundFinishedBoard";


const roundModeCaptions = {
    cooldown: "Cooldown",  
    rounds: "Раунды", 
    finished: "Раунд завершен", 
};

    
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

    return (
        <Card title={caption} 
            extra={<UserName />} 
            style={{ maxWidth: "850px", minWidth: "550px" }}>
            <img src={goose} onClick={handleTapOnGoose} alt="goose" height="320px" width="320px" />
            <Divider />
            {roundMode === "cooldown" && <CooldownTimeBoard roundMode={roundMode} startTime={startTime} /> }
            {roundMode === "rounds" && 
                <RoundsBoard roundMode={roundMode} endTime={endTime} myStat={myStat} roundItem={roundItem} />                   
            }
            {roundMode === "finished" &&  
                <RoundFinishedBoard myStat={myStat} roundItem={roundItem}  />                
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