
interface screenLoaderI  {
    enable: boolean
}

export const ScreenLoader = ({enable}: screenLoaderI) => {
    return <>{
        enable? <p style={{
            zIndex: "5",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "25rem",
            color: "rgb(190, 176, 111)",
            font: "30px Arial bolder Georgia, serif",
            opacity: 0.5,
            borderRadius: "2rem",
            boxShadow: "0px 0px 5px #fff;"
        }}>Loading...</p>:null
    }</>

}