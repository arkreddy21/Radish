import {useParams} from "react-router-dom"

function SubredditPage() {
  const {subid} = useParams();

  return (
    <div>{`SubredditPage of ${subid}`}</div>
  )
}

export default SubredditPage