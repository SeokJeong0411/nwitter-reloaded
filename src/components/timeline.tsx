import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Nweet from "./nweet";

export interface ITweet {
  id: string;
  atchmntUrl?: string;
  text: string;
  crtrId: string;
  crtrNm: string;
  crtdDt: number;
}

const Wrapper = styled.div``;

export default function TimeLine() {
  const [nweets, setNweets] = useState<ITweet[]>([]);
  const fetchNweets = async () => {
    const nweetsQuery = query(collection(db, "nweets2"), orderBy("crtdDt", "desc"));
    const snapshot = await getDocs(nweetsQuery);
    const nweets = snapshot.docs.map((doc) => {
      const { text, crtrId, crtrNm, crtdDt, atchmntUrl } = doc.data();
      return {
        text,
        crtdDt,
        crtrId,
        crtrNm,
        atchmntUrl,
        id: doc.id,
      };
    });
    setNweets(nweets);
  };
  useEffect(() => {
    fetchNweets();
  }, []);

  return (
    <Wrapper>
      {nweets.map((nweet) => (
        <Nweet key={nweet.id} {...nweet} />
      ))}
    </Wrapper>
  );
}
