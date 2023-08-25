import { useState, useEffect } from "react"
import { FiPlus, FiSearch } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

import { Container, Brand, Menu, Search, Content, NewNote } from "./style"

import { api } from "../../services/api"

import { Header } from "../../components/Header"
import { ButtonText } from "../../components/ButtonText"
import { Section } from "../../components/Section"
import { Note } from "../../components/Note"
import { Input } from "../../components/Input"

export function Home() {
    const [tags, setTags] = useState([])
    const [tagsSelected, setTagsSelected] = useState([])
    const [search, setSearch] = useState("")
    const [notes, setNotes] = useState([])

    const navigate = useNavigate()

    function handleTagSelected(tagName) {
        if(tagName === "all") {
            return setTagsSelected([])
        }

        const alreadySelected = tagsSelected.includes(tagName)

        if(alreadySelected) {
            const filteredTags = tagsSelected.filter(tag => tag !== tagName)
            setTagsSelected(filteredTags)
        } else {
        setTagsSelected(prevState => [...prevState, tagName])
        }
    }

    function handleDetails(id) {
        navigate(`/details/${id}`)
    }

    useEffect(() => {
        async function fetchTags() {
            const response = await api.get("/tags")
            setTags(response.data)
        }

        fetchTags()
    }, [])

    useEffect(() => {
        async function fetchNotes() {
            const response = await api.get(`/notes?title=${search}&tags=${tagsSelected}`)
            setNotes(response.data)
        }

        fetchNotes()
    }, [tagsSelected, search])

    return(
        <Container>
            <Header />

            <Brand>
                <h1>Rocketnotes</h1>
            </Brand>

            <Menu>
                <li><ButtonText 
                title="Todos" 
                onClick={() => handleTagSelected("all")}
                $isactive={tagsSelected.length === 0}
                />
                </li>
                {
                tags && tags.map(tag => (
                    <li>
                    <ButtonText 
                    key={String(tag.id)} 
                    title={tag.name} 
                    onClick={() => handleTagSelected(tag.name)}
                    $isactive={tagsSelected.includes(tag.name)}
                    />
                    </li>
                ))
                }
            </Menu>

            <Search>
                <Input 
                placeholder="Pesquisar pelo titulo" 
                icon={FiSearch}
                onChange={(e) => setSearch(e.target.value)}
                />
            </Search>

            <Content>
                <Section title="Minhas notas">
                    {
                    notes.map(note => (
                    <Note
                        key={String(note.id)}
                        data={note}
                        onClick={() => handleDetails(note.id)}
                    />
                    ))
                    }
                </Section>
            </Content>

            <NewNote to="/new">
                <FiPlus />
                Criar nota
            </NewNote>
        </Container>
    )
}