import { useState } from "react";
import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 5px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const SaveButton = styled.input`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  padding: 5px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
    "Helvetica Neue", sans-serif;
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const AttachFileButton = styled.label`
  cursor: pointer;
`;

export default function Nweet({ text, crtrNm, crtrId, atchmntUrl, id }: ITweet) {
  const user = auth.currentUser;
  const [isEdit, setEdit] = useState(false);
  const [nweetText, setNweetText] = useState(text);
  const [fileUrl, setFileUrl] = useState(atchmntUrl);
  const [file, setFile] = useState<File | null>(null);

  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this nweet?");

    if (!ok || user?.uid !== crtrId) return;
    try {
      await deleteDoc(doc(db, "nweets2", id));
      if (atchmntUrl) {
        const photoRef = ref(storage, `nweets2/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user?.uid !== crtrId || !user) return;
    console.log("chagne");

    try {
      setEdit(false);
      let url = "";

      // setLoading(true);
      if (file) {
        if (atchmntUrl) {
          const photoRef = ref(storage, `nweets2/${user.uid}/${id}`);
          await deleteObject(photoRef);
        }

        const locationRef = ref(storage, `nweets2/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, file);
        url = await getDownloadURL(result.ref);
      }

      await updateDoc(doc(db, "nweets2", id), { text: nweetText, updtDt: Date.now(), atchmntUrl: url });
      // setNweetText("");
      // setFile(null);
    } catch (e) {
      console.log(e);
    }
  };
  const onDeleteAtchmnt = async () => {
    try {
      if (atchmntUrl) {
        const photoRef = ref(storage, `nweets2/${user?.uid}/${id}`);
        await deleteObject(photoRef);
      }
      await updateDoc(doc(db, "nweets2", id), { atchmntUrl: "" });
    } catch (e) {
      console.log(e);
    }
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      console.log("q23rhq3io3wrq3rw");
      if (files[0].size > 1024 ** 2) {
        alert("Image size must be less than 1MB");
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onloadend = (finishiedEvent: ProgressEvent<FileReader>) => {
          console.log(finishiedEvent);
          if (finishiedEvent) {
            setFileUrl(finishiedEvent?.currentTarget.result);
          }
        };

        setFile(files[0]);
      }
    }
  };
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNweetText(event.target.value);
  };
  const toggleEdit = () => {
    setEdit((prev) => !prev);
    setNweetText(text);
    setFileUrl(atchmntUrl);
    setFile(null);
  };

  return (
    <>
      {isEdit ? (
        <Form onSubmit={onSubmit}>
          <Column>
            <Username>{crtrNm}</Username>
            <TextArea maxLength={180} onChange={onChange} value={nweetText} required />
            <Buttons>
              <SaveButton type="submit" value="Update Nweet" className="formBtn" />
              <DeleteButton onClick={toggleEdit}>Cancel</DeleteButton>
              <DeleteButton onClick={onDeleteAtchmnt}>Delete Image</DeleteButton>
            </Buttons>
          </Column>
          <Column>
            {fileUrl ? (
              <>
                <AttachFileButton htmlFor={`file_${id}`}>
                  <Photo src={fileUrl} />
                </AttachFileButton>
                <AttachFileInput onChange={onFileChange} id={`file_${id}`} type="file" accept="image/*" />
              </>
            ) : null}
          </Column>
        </Form>
      ) : (
        <Wrapper>
          <Column>
            <Username>{crtrNm}</Username>
            <Payload>{text}</Payload>
            {user?.uid === crtrId ? (
              <Buttons>
                <EditButton onClick={toggleEdit}>Edit</EditButton>
                <DeleteButton onClick={onDelete}>Delete</DeleteButton>
              </Buttons>
            ) : null}
          </Column>
          <Column>{atchmntUrl ? <Photo src={atchmntUrl} /> : null}</Column>
        </Wrapper>
      )}
    </>
  );
}
