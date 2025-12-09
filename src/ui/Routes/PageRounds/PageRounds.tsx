import { useMemo, useState, useEffect } from "react";
import { Button, Card, Divider, Spin } from "antd"
import { useNavigate } from "react-router";
import { useAuthMeQuery, useCreateRoundMutation, useRoundsQuery } from "query/api/appApi.api";

import "./styles.css";

import { authGuard } from "../../authGuard";
import { UserName } from "../../Shared/UserName";
import type { RoundMode } from "domain/Rounds";
import { leadingZeros } from "../../../libs/leadingZeros";


const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return `${leadingZeros(date.getDate(), 2)}.${leadingZeros(date.getMonth()+1, 2)}.${date.getFullYear()} ${leadingZeros(date.getHours(), 2)}:${leadingZeros(date.getMinutes(), 2)}:${leadingZeros(date.getSeconds(), 2)}`;
};

const roundModeCaptions = {
    cooldown: "Cooldown",  
    rounds: "Активен", 
    finished: "Раунд завершен", 
};

export const PageRoundsBase = () => {
    const { data: user } = useAuthMeQuery();
    const { data: rounds } = useRoundsQuery();
    const [mutationCreateRound] = useCreateRoundMutation();
    const navigate = useNavigate();
    const [currentDateTime, setCurrentDateTime] = useState(Date.now());
    const roundsStatuses = useMemo(() => {
        return rounds?.data.reduce((map, round) => {
            let status: RoundMode = "finished";
            
            if (currentDateTime < new Date(round.startTime).getTime()) {
                status = "cooldown"
            } else if (currentDateTime < new Date(round.endTime).getTime()) {
                status = "rounds"
            }
             
            map.set(round.id, status)

            return map;
        }, new Map<string, RoundMode>());
    }, [rounds, currentDateTime]);

    useEffect(() => {
        const tiemoutDescriptor = setInterval(() => {
            setCurrentDateTime(Date.now());      
        }, 1000);

        return () => {
            clearInterval(tiemoutDescriptor)
        };
    }, []);

    const handleCreateRound = async () => {
        try {
            const newRound = await mutationCreateRound()
        } catch (error) {
            console.log(error);
        }    
    };
    
    if (!user || !rounds) {
        return <div><Spin /></div>
    }

    // Список раундов - {String(user?.username)} - {JSON.stringify(rounds?.data)}
    return (
        <>            
            <Card title="Список раундов" extra={<UserName />} style={{ maxWidth: "850px", minWidth: "550px" }}>
                {user!.role === "ADMIN" && <Button onClick={handleCreateRound}>Create new round</Button>}
                <ul className="round-list">
                    {rounds!.data.map((round) => {
                        return <li key={round.id} onClick={() => navigate(`/rounds/${round.id}`)}>
                            <dl>
                                <dt>● Round ID:</dt>
                                <dd>{round.id}</dd>

                                <dt>Start</dt>
                                <dd>{formatDate(round.startTime)}</dd>

                                <dt>End</dt>
                                <dd>{formatDate(round.endTime)}</dd>                               
                            </dl>
                            <Divider />
                            {roundsStatuses &&
                                <dl>
                                    <dt>Статус:</dt>
                                    <dd>{roundModeCaptions[roundsStatuses.get(round.id)!]}</dd>                              
                                </dl>
                            }
                        </li>
                    })}
                </ul>
            </Card>
        </>
    );
}


const PageRounds = authGuard(PageRoundsBase);

export default PageRounds;