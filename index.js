
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())

app.use(morgan('tiny'))

app.use(morgan(':method :url :response-time ms'))

app.use(cors())

app.use(express.static('build'))
/*
let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Kalle Kajaani',
    number: '343-66611',
    id: 2
  },
  {
    name: 'Liisa Luotsari',
    number: '90-02566',
    id: 3
  },
  {
    name: 'Salla Sahaaja ',
    number: '333-666',
    id: 4
  }
]
*/

morgan.token('content', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :content :response-time ms'))


app.get('/api/persons', (req, res) => {
  Person
    .find({}, { __v: 0 })
    .then(people => {
      res.json(people.map(Person.format))
    })
})

app.get('/info', (req, res) => {
  var size = Person.find({}).size
  Person.find({})
    .then(people => {
      res.send(`<p>puhelinluettelossa ${people.length} henkilön tiedot</p>
              <p>${new Date()}</p>`)

    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(Person.format(person))
    })
    .catch(error => {
      console.log(error)
      res.status.apply(404).end()
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(404).send({ error: 'malformated id' })
    })
})

app.put('/api/persons/:id', (request, response) => {
  console.log("moi")
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformated id' })
    })
})

app.post('/api/persons', (request, response) => {
  const reqBody = request.body
  if (!reqBody.name) {
    return response.status(400).json({ error: 'Name missing' })
  } if (!reqBody.number) {
    return response.status(400).json({ error: 'Number missing!' })
  }
  Person
    .find({ name: reqBody.name })
    .then(result => {
      if (result.length > 0) {
        return response.status(409).json({ error: 'name is already in list!' })
      } else {
        const person = new Person({
          name: reqBody.name,
          number: reqBody.number
        })

        person
          .save()
          .then(result => {
            response.json(Person.format(result))
          })
      }
    })
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Alkuperäinen id:n luonti ekoista tehtävistä.
//  const id = Math.floor((Math.random() * 1000000) +1)
//  person.id = id
//if (person.id < 10){                       
//      person.id += Math.floor((Math.random() * 100) +1)
//  }
