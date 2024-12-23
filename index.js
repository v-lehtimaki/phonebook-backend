const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body)
})

// Middleware
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
  "name": "Ville Lehtimäki",
  "number": "1234567",
  "id": "1"
  },
  {
  "name": "Ada Lovelace",
  "number": "39-44-5323523",
  "id": "2"
  },
  {
  "name": "Dan Abramov",
  "number": "12-43-234345",
  "id": "3"
  },
  {
  "name": "Mary Poppendieck",
  "number": "39-23-6423122",
  "id": "4"
  },
  {
  "id": "4fbc",
  "name": "Kalle Koivunen",
  "number": "69696969"
  }
]

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled).toString(); // The maximum is inclusive and the minimum is inclusive
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  let now = new Date()
  now = now.toString()
  response.send(`<p>Phonebook has info for ${persons.length} people</p> 
    <p>${now}</p>`)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name is missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'Number is missing' 
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'Name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: getRandomIntInclusive(1, 20000),
  }

  persons = persons.concat(person)

  console.log('Persons: ', persons);

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  console.log('Persons (delete): ', persons);
  
  deletedPerson = persons.find(deletedPerson => deletedPerson.id === id)
  persons = persons.filter(person => person.id !== id)
  

  console.log('Persons: ', persons);
  console.log('deletedPerson: ', deletedPerson);
  

  response.json(deletedPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})