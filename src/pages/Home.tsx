import illustration from "../assets/images/illustration.svg"
import logoLetMeAsk from "../assets/images/logo.svg"
import logoGoogle from "../assets/images/google_icon.svg"
import "../styles/auth.scss"
import { Button } from "../Button";
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../App";
import { useContext, FormEvent, useState } from "react";
import { get, ref } from "firebase/database";
import { database } from "../services/Firebase";

export function Home() {
    const navigator = useNavigate();
    const { user, signInWithGoogle } = useContext(AuthContext);
    const [roomCode, setRoomCode] = useState("");

    async function handleRoomCreation() {
        if(!user) {
            await signInWithGoogle();
        }
        
        navigator("/rooms/new");
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if(roomCode.trim() === "") {
            return;
        }

        const roomRef = get(ref(database, `rooms/${roomCode}`));

        if(!(await roomRef).exists()) {
            alert("Room does not exist!");
            return;
        }
        
        navigator(`/rooms/${roomCode}`);
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
                    <Button id="google-button" onClick={ handleRoomCreation }>
                        <img src={logoGoogle} alt="Logo do google"/>
                        Crie sua sala com o google
                    </Button>
                    <div id="separador">Ou entre em uma sala</div>
                    <form className="form" onSubmit={handleJoinRoom}>
                        <input 
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">Entrar na sala</Button>
                    </form>
                </div>
            </main>
        </div>
    );
}