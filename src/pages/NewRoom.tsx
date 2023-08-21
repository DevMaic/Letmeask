import illustration from "../assets/images/illustration.svg"
import logoLetMeAsk from "../assets/images/logo.svg"
import "../styles/auth.scss"
import { Button } from "../Button";
import { Link } from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "../App";

export function NewRoom() {
    const { user } = useContext(AuthContext); 

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
                    <form className="form">
                        <input type="text" placeholder="Nome da sala"/>
                        <Button type="submit">Criar sala</Button>
                        <p>Quer entrar em uma sala existente? <Link to="/">clique aqui</Link></p>
                    </form>
                </div>  
            </main>
        </div>
    );
}