import { useParams } from "react-router-dom";
import { PostComponent } from "../components";

function PostPage() {
  const {subid, id, name} = useParams()

  return (<PostComponent subid={subid||''} id={id||""} name={name||""} />)
}

export default PostPage
