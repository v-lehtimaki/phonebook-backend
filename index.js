require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')
const morgan = require('morgan')

morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body)
})

// Middleware
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled).toString(); // The maximum is inclusive and the minimum is inclusive
}

// Get all persons.
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

// Get a person by id.
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/info', (request, response) => {
  let now = new Date()
  now = now.toString()
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> 
      <p>${now}</p>`)
  })
})

// Create a new person.
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name is missing' 
    })
  }

  if (!body.phoneNumber) {
    return response.status(400).json({ 
      error: 'Number is missing' 
    })
  }

  /* if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'Name must be unique' 
    })
  } */
  console.log(`Phone number: ${body.phoneNumber}`);
  
  const person = new Person({
    name: body.name,
    phoneNumber: body.phoneNumber
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

// Update a person's info by id.
app.put('/api/persons/:id', (request, response, next) => {
  const { name, phoneNumber } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.phoneNumber = phoneNumber

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})


// Delete a person by id.
app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// tämä tulee kaikkien muiden middlewarejen ja routejen rekisteröinnin jälkeen!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})