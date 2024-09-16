import { TailSpin,BallTriangle } from "react-loader-spinner"

export const TailSpinLoader = () => {
    return (
        <div className="flex justify-center items-center h-fit ">
        <TailSpin
            color="#5538CE"
            height={40}
            width={40} 
        />
        </div>
    )
}

export const BallTriangleLoader = ()=> {
    return (
        <BallTriangle
            color="#5538CE"
            height={40}
            width={40}
        />
    )
}