import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LiveHearts from './LiveHearts';



const Skulls = ({Attempts}) => {
    const skull = <i class="fa-solid fa-skull" style={{color: "#606060"}}></i>
    return <>
            {Array.from({ length: Math.max(Math.floor(Math.log2(Attempts/2))-1, 1) }).map((_, i) =>
                <span key={`skull-${i}`}>{skull}</span>
            )}
        </>
}


const FriendCard = ({NickName, Attempts, Icon, Color, isFinished, FriendId}) => {
    const navigate = useNavigate();
    const deadColor = "#606060";
    const start = <div className="flex flex-row justify-center items-center gap-2 pulsing">
        <i className="fa-solid fa-play text-sm text-white"></i>
        <p className="text-white text-sm">{(Attempts > 0) ? "Salvar" : "Comenzar"}</p>
    </div>;
    const [isHovered, setIsHovered] = useState(false);

    const itsOk = <div className={`${(isHovered)?" text-white gap-2 flex":" text-gray-400 gap-2 flex"}`}>
        <i className="fa-solid fa-circle-check"></i>
        <i className="fa-solid fa-circle-check"></i>
        <i className="fa-solid fa-circle-check"></i>
    </div>

    const onClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isFinished) {
            navigate("/form", {
            state: {
                FriendId: FriendId,
            }});
        }
        };



  return (
    <div className={`${(isHovered) ? (`bg-[${((Attempts >= 4) ? deadColor: Color)}]`) : "bg-white"} flex flex-col gap-x-px relative sm:rounded-md grow-0 m-2 ${(isFinished && Attempts < 4) ? "goldenShadow" : "subtleshadow"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        >
    
        <div className={`bg-[${((Attempts >= 4) ? deadColor: Color)}] rounded-full flex w-9 h-9 justify-center items-center absolute scale-[1.2]`}
            style={{left: '-16px', top:"-2px", transition: 'top 0.2s, left 0.2s' }}>
            <i className={Icon} style={{ color: "#ffffff", fontSize: ((Attempts >= 4) ? "0.8rem" :"1.2rem"), margin: "auto" }}></i>
        </div>

        <div className={`bg-[${((Attempts >= 4) ? deadColor : Color)}] px-10 py-1 sm:rounded-md lexend-charly text-white `}>
            <h2>{NickName}</h2>
        </div>

        <div className={`flex flex-row justify-center items-center gap-1 py-2`}>
            
            {
                (isHovered && !isFinished) ? start : (
                    (Attempts < 4) ? (
                        <LiveHearts Attempts={Attempts} isFinished={isFinished}/>
                    ): (
                        (isFinished) ? itsOk: (<Skulls Attempts={Attempts}/>)
                    )
                )
            }


        </div>
    </div>

  );
};

export default FriendCard;