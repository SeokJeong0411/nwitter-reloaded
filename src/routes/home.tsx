import styled from "styled-components";
import PostNweetForm from "../components/post-nweet-form";
import TimeLine from "../components/timeline";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: auto;
  grid-template-rows: 1fr 5fr;
`;

export default function Home() {
  return (
    <Wrapper>
      <PostNweetForm />
      <TimeLine />
    </Wrapper>
  );
}
