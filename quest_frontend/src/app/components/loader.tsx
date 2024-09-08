import { TailSpin,BallTriangle } from "react-loader-spinner"

export const TailSpinLoader = () => {
    return (
        <TailSpin
            color="#00BFFF"
            height={40}
            width={40} 
        />
    )
}

export const BallTriangleLoader = ()=> {
    return (
        <BallTriangle
            color="#00BFFF"
            height={40}
            width={40}
        />
    )
}