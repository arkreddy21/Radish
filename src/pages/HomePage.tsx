import {SegmentedControl, Text} from "@mantine/core";
import { useQuery, useInfiniteQuery } from "react-query";
import { useEffect, useState } from "react";
import { PostCard} from "../components";
import { useGlobalContext } from "../context";
import { getHomePage} from "../utils/RedditAPI";

function HomePage() {
  const {tokens, isEnabled } = useGlobalContext();
  //TODO: useQuery fetching even when enabled: false?
  //TODO? include access token in query key
  const { isLoading, isFetchingNextPage, data, fetchNextPage } = useInfiniteQuery(
    ["home-page",tokens, isEnabled], ({pageParam}) => getHomePage(tokens.access, pageParam),
    { enabled: isEnabled, getNextPageParam:(lastpage,pages)=>{console.log(lastpage.data.after);return lastpage.data.after} }
  );
  const [sort, setSort] = useState("best");

  useEffect(() => {
    console.log(isEnabled)
  }, [isEnabled]);

  useEffect(()=>{
    const event:any= window.addEventListener('scroll',()=>{
      if(!isLoading && window.innerHeight+window.scrollY >= document.body.scrollHeight-8 ){
        fetchNextPage()
      }})
    return ()=>window.removeEventListener('scroll',event)
  },[])

  if (isLoading) return <h3>Loading</h3>;

  return (
    <>
      <div>HomePage</div>
      <SegmentedControl
        value={sort}
        onChange={setSort}
        data={[
          { label: "best", value: "best" },
          { label: "hot", value: "hot" },
          { label: "new", value: "new" },
          { label: "top", value: "top" },
        ]}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        
        {data?.pages.map((group, i)=>(
          <>
            {group.data.children.map((child: any) => {
          return <PostCard data={child.data} access = {tokens.access} />;
        })}
          </>
        ))}
      </div>
      <Text>{isFetchingNextPage ? 'Loading more...' : ''}</Text>
    </>
  );
}

export default HomePage;
