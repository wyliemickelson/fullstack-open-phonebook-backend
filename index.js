const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(cors())
app.use(morgan(':method :url :status :response-time ms - :data'))
app.use(express.json())

morgan.token('data', (req, res) => {
  return JSON.stringify(req.body)
})

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max(...persons.map(p => p.id))
  : 0
  return maxId + 1
}

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (!person) {
    return response.status(404).end()
  } else {
    response.json(person)
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  const { name, number } = body
  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }
  if (persons.find(p => p.name.toUpperCase() === name.toUpperCase())) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name,
    number,
  }
  persons = persons.concat(person)
  response.json(person)
})

app.get('/info', (request, response) => {
  const now = new Date(Date.now())
  response.send(
    `<div>
      <p>Phonebook has info for ${persons.length} people.</p>
      <p>${now}</p>
    <div>`)
})

const PORT = process.env.PORT ?? 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})