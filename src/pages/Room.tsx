import logoImg from "../assets/images/logo.svg"
import copySimbol from "../assets/images/copy.svg"
import balloons from "../assets/images/baloons.svg"
import { Button } from "../components/Button";
import "../styles/rooms.scss"
import { useParams } from "react-router-dom";
import { FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import { database } from "../services/Firebase";
import { get, push, ref, onValue, DataSnapshot, off } from "firebase/database";
import { Questions } from "../components/Questions";
import React from "react";

type typeParams = {
    id: string;
}

type FireBaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnsweared: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string,
    }>
}>

type Question = {
    id: string,
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnsweared: boolean;
    isHighlighted: boolean;
    likeCount: number;
    hasLiked: string | undefined;
}

export function Room() {
    const params = useParams<typeParams>();
    const { user } = useContext(AuthContext);
    const [newQuestion, setNewQuestion] = useState("");
    const roomId = params.id!;
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);

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
            // setQuestions(fireBaseQuestions);
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
                    likeCount: Object.values(value.likes ?? {}).length,
                    hasLiked: Object.entries(value.likes ?? {}).find(([key, value]) => value.authorId === user?.id)?.[0]
                }
            })
            
            // console.log(parsedQuestion)
            setQuestions(parsedQuestion);
        })

        return () => {
            off(ref(database, `/rooms/${roomId}/questions`));
        }

    }, [roomId, user?.id]);

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
                    <div id="titulo">{numberOfQuestions} pergunta(s)</div>
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
                {
                    questions.map(Question => {
                        return (
                            <Questions
                                key={Question.id}
                                content={Question.content}
                                author={Question.author}
                                roomId = {roomId}
                                chave={Question.id}
                                likeCount={Question.likeCount}
                                hasLiked={Question.hasLiked}
                            ></Questions>
                        )
                    })
                }
            </body>
        </div>
    );
}