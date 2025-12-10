import { useEffect, useMemo, useState } from "react";
import type { RoundMode } from "domain/Rounds";

import { leadingZeros } from "../../../libs/leadingZeros";

export const useCooldownTime = (roundMode: RoundMode, timingMode: RoundMode, startTime:number) => {
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
};