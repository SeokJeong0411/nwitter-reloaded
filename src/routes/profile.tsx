import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Nweet from "../components/nweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const NameWrapper = styled.div`
  display: flex;
  gap: 5px;
`;

const Name = styled.span`
  font-size: 22px;
  padding: 4px 4px;
`;

const Nweets = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

const ChangeNameBtn = styled.div`
  width: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &.save-name {
    color: #1d9bf0;
  }
`;

const InputName = styled.input`
  color: white;
  font-size: 22px;
  background-color: black;
  border: 1px solid;
  border-radius: 5px;
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [nweets, setNweets] = useState<ITweet[]>([]);
  const [name, setName] = useState(user?.displayName || "");
  const [nameEdit, setNameEdit] = useState(false);

  const fetchNweets = async () => {
    const nweetQuery = query(
      collection(db, "nweets2"),
      where("crtrId", "==", user?.uid),
      orderBy("crtdDt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(nweetQuery);
    const nweetArr = snapshot.docs.map((doc) => {
      const { text, crtdDt, crtrId, crtrNm, atchmntUrl } = doc.data();
      return {
        text,
        crtdDt,
        crtrId,
        crtrNm,
        atchmntUrl,
        id: doc.id,
      };
    });

    setNweets(nweetArr);
  };

  useEffect(() => {
    fetchNweets();
  }, []);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length == 1) {
      const file = files[0];

      const locationRef = ref(storage, `avatars/${user?.uid}`);

      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  const onClickChangeName = () => {
    setNameEdit((prev) => !prev);
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const changeName = () => {
    if (user) {
      if (!name) {
        alert("Please fill your Nickname");
        return;
      }
      updateProfile(user, { displayName: name });
    }
    setNameEdit((prev) => !prev);
  };

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*" />

      <NameWrapper>
        {nameEdit ? (
          <>
            <InputName onChange={onChangeName} value={name} />
            <ChangeNameBtn onClick={changeName} className="save-name">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </ChangeNameBtn>
          </>
        ) : (
          <>
            <Name>{name ?? "Anonymous"}</Name>
            <ChangeNameBtn onClick={onClickChangeName}>
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </ChangeNameBtn>
          </>
        )}
      </NameWrapper>

      <Nweets>
        {nweets.map((nweet) => (
          <Nweet key={nweet.id} {...nweet}></Nweet>
        ))}
      </Nweets>
    </Wrapper>
  );
}
