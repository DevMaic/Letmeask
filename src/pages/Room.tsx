import logoImg from "../assets/images/logo.svg"
import copySimbol from "../assets/images/copy.svg"
import balloons from "../assets/images/baloons.svg"
import { Button } from "../Button";
import "../styles/rooms.scss"
import { useParams } from "react-router-dom";
import { FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import { database } from "../services/Firebase";
import { get, push, ref, onValue, DataSnapshot } from "firebase/database";

type typeParams = {
    id: string;
}

type FireBaseQuestions = Record<string, {
    author: {
        name: String;
        avatar: String;
    };
    content: String;
    isAnsweared: boolean;
    isHighlighted: boolean;
}>

export function Room() {
    const params = useParams<typeParams>();
    const { user } = useContext(AuthContext)
    const [newQuestion, setNewQuestion] = useState("");
    const roomId = params.id;
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState({});

    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(params.id!);
        alert("copied");
    }

    async function handleNewQuestion(event: FormEvent) {
        event.preventDefault();

        if(newQuestion.trim() === "") {
            return;
        }

        if(!user) {
            throw new Error("You must be logged in!");
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighLighted: false,
            isAnsweared: false,
        }

        await push(ref(database, `rooms/${params.id}/questions`), question);

        setNewQuestion("");
    }

    useEffect(() => {
        onValue(ref(database, `/rooms/${roomId}/questions`), (snapshot: DataSnapshot) => {
            const fireBaseQuestions: FireBaseQuestions = snapshot.val() || {};
            setQuestions(fireBaseQuestions);
            setNumberOfQuestions(snapshot.size);
            get(ref(database, `/rooms/${roomId}/title`)).then( value => {
                setTitle(value.val());
            })
            
            const parsedQuestion = Object.entries(fireBaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnsweared: value.isAnsweared,
                }
            })
            
            console.log(parsedQuestion)
        })

    }, [roomId]);

    return (
        <div id="page-room">
            <header>
                <img src={logoImg} alt="Logo letmeask"/>
                <div>
                    <button onClick={copyRoomCodeToClipboard}>
                        <img src={copySimbol} alt="Símbolo de cópia"/>
                        <div>{params.id}</div>
                    </button>
                </div>
            </header>
            <body>
                <div>
                    <h1>Sala {title}</h1>
                    <div>{numberOfQuestions} pergunta(s)</div>
                </div>
                
                <form onSubmit={handleNewQuestion}>
                    <textarea 
                        onChange={event => setNewQuestion(event.target.value)}
                        placeholder="O que você quer perguntar?"
                        value={newQuestion}
                    />
                    <div>
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <h3>Para enviar uma pergunta, <button>faça seu login.</button></h3>
                        )}
                        <Button>Enviar pergunta</Button>
                    </div>
                </form>
                {JSON.stringify(questions)}
                {/* <img src={balloons} alt="Imagem de balões de fala"/>
                <p><h3>Nenhuma pergunta por aqui...</h3></p>
                <h2>Envie o código dessa sala para seus amigos e comece a responder perguntas!</h2> */}
            </body>
        </div>
    );
}