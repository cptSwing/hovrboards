import { useState } from 'react';

// TODO on board switch, move old to left and new in from right. Copy this component, then unmount?
const useStageEnterExit = (currentPos: [x: number, y: number, z: number]) => {
    const [newPos, _setNewPos] = useState(currentPos);

    // useEffect(() => {
    //     setGroupPos([-5, 0, 0]);
    //     const timer = setTimeout(() => {
    //         setGroupPos([0, 0, 0]);
    //     }, 200);
    // }, [board]);

    return newPos;
};

export default useStageEnterExit;
