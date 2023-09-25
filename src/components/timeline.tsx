import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Nweet from "./nweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  atchmntUrl?: string;
  text: string;
  crtrId: string;
  crtrNm: string;
  crtdDt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default function TimeLine() {
  const [nweets, setNweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchNweets = async () => {
      const nweetsQuery = query(collection(db, "nweets2"), orderBy("crtdDt", "desc"), limit(25));
      // const snapshot = await getDocs(nweetsQuery);
      // const nweets = snapshot.docs.map((doc) => {
      //   const { text, crtrId, crtrNm, crtdDt, atchmntUrl } = doc.data();
      //   return {
      //     text,
      //     crtdDt,
      //     crtrId,
      //     crtrNm,
      //     atchmntUrl,
      //     id: doc.id,
      //   };
      // });
      unsubscribe = await onSnapshot(nweetsQuery, (snapshot) => {
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
      });
    };
    fetchNweets();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {nweets.map((nweet) => (
        <Nweet key={nweet.id} {...nweet} />
      ))}
    </Wrapper>
  );
}
