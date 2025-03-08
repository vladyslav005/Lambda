// @ts-ignore
import loadingGif from "../../../assets/rolling.gif"


export const LoadingIndicator = () => {
  return (
      <img src={loadingGif} alt={"Loading"}

           style={{
             marginLeft: "auto",
             marginRight: "auto",
             marginBottom: "auto",
             marginTop: "10%",
             width: "100px",
             height: "100px"
           }}
      />

  )
}