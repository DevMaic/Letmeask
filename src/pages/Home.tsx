import illustration from "../assets/images/illustration.svg"
import logoLetMeAsk from "../assets/images/logo.svg"
import logoGoogle from "../assets/images/google_icon.svg"
import "../styles/auth.scss"
import { Button } from "../Button";
import { useNavigate } from "react-router-dom"
import { auth, app } from "../services/Firebase";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { AuthContext } from "../App";
import { useContext } from "react";

export function Home() {
    const navigator = useNavigate();
    const { user, signInWithGoogle } = useContext(AuthContext);

    async function handleRoomCreation() {
        if(!user) {
            await signInWithGoogle();
        }
        
        navigator("/rooms/new");
    }
    return (
        <div id="page-auth">
            <aside>
                <img src={illustration} alt="Ilustração simbolizando perguntas e respostas"/>
                <h1><strong>Toda pergunta tem uma resposta.</strong></h1>
                <h2>Aprenda a compartilhar conhecimento com outras pessoas</h2>
            </aside>
            <main>
                <div>
                    <img src={logoLetMeAsk} alt="Logo letmeask"/>
                    <Button onClick={ handleRoomCreation }>
                        <img src={logoGoogle} alt="Logo do google"/>
                        Crie sua sala com o google
                    </Button>
                    <div id="separador">Ou entre em uma sala</div>
                    <form className="form">
                        <input type="text" placeholder="Digite o código da sala"/>
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    );
}