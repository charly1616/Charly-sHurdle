import react from "react"


const LiveHearts = ({Attempts, isFinished,TextSize="1rem"}) => {
    const heart = <i class="fa-solid fa-heart" style={{color: "#ff6464", fontSize: TextSize}}></i>;
    const broken = <i class="fa-solid fa-heart-crack" style={{color: "#e7e7e7", fontSize: TextSize}}></i>;
    const trophy = <i class="shiningText fa-solid fa-crown" style={{color: "#ffd700", fontSize: TextSize}}></i>;

    return <>
            {Array.from({ length: 4 - Attempts }).map((_, i) => (
                (isFinished) ? <span key={`trophy-${i}`}>{trophy}</span> :
                <span key={`heart-${i}`}>{heart}</span>
            ))}
            {Array.from({ length: Attempts }).map((_, i) => (
                (!isFinished) ? <span key={`broken-${i}`}>{broken}</span> : <></>
            ))}
        </>
}

export default LiveHearts;
