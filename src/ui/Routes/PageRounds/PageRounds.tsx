import { Button, Card } from "antd"
import { useAuthMeQuery, useCreateRoundMutation, useRoundsQuery } from "query/api/appApi.api";
import { Spin } from 'antd';

import "./styles.css";

import { authGuard } from "../../authGuard";

export const SimplePageBase = () => {
    const { data: user } = useAuthMeQuery(null);
    const { data: rounds } = useRoundsQuery(null);
    const [mutationCreateRound] = useCreateRoundMutation();

    const handleCreateRound = async () => {
        try {
            const newRound = await mutationCreateRound(null)
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
            <Card title="Список раундов" extra={String(user!.username)} style={{ maxWidth: "850px", minWidth: "550px" }}>
                {user!.role === "ADMIN" && <Button onClick={handleCreateRound}>Create new round</Button>}
                <ul className="round-list">
                    {rounds!.data.map((round) => {
                        return <li key={round.id}>
                            <dl>
                                <dt>id</dt>
                                <dd>{round.id}</dd>

                                <dt>createdAt</dt>
                                <dd>{round.createdAt}</dd>

                                <dt>endTime</dt>
                                <dd>{round.endTime}</dd>

                                <dt>totalScore</dt>
                                <dd>{round.totalScore}</dd>

                                <dt>startTime</dt>
                                <dd>{round.startTime}</dd>
                            </dl>
                        </li>
                    })}
                </ul>
            </Card>
        </>
    );
}


const SimplePage = authGuard(SimplePageBase);

export default SimplePage;