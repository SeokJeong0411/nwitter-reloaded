import styled from "styled-components";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button, Logo } from "./social-components";

export default function GoogleButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/google-logo.svg" />
      Continue with Google
    </Button>
  );
}
