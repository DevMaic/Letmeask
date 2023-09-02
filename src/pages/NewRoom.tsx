import illustration from "../assets/images/illustration.svg"
import logoLetMeAsk from "../assets/images/logo.svg"
import "../styles/auth.scss"
import { Button } from "../components/Button";
import { Link, useNavigate } from "react-router-dom"
import { useState, FormEvent } from "react";
import { push, ref } from "firebase/database";
import { database, auth } from "../services/Firebase";

export function NewRoom() {
    const [newRoom, setNewRoom] = useState("");
    const navigator = useNavigate();

    function handleCreateRoom(event: FormEvent) {
        event.preventDefault();

        const reference = push(ref(database, "rooms"), {
            title: newRoom,
            authorId: auth.currentUser?.uid
        })

        navigator(`/rooms/${reference.key}`); 
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
                    <h2>Criar uma nova sala</h2>
                    <form className="form" onSubmit={handleCreateRoom}>
                        <input 
                            type="text" 
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                        />
                        <Button type="submit">Criar sala</Button>
                        <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
                    </form>
                </div>  
            </main>
        </div>
    );
}