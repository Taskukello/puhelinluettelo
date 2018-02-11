

const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.json())

app.use(morgan('tiny'))

app.use(morgan(':method :url :response-time ms'))

app.use(cors())

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


morgan.token('content', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :content :response-time ms'))


app.get('/api/persons', (req, res) =>{
  res.json(persons)
})

app.get('/info', (req, res) =>  {
  const size = persons.length
  var d = new Date()
  var str = "<p> Puhelinluettelossa " + size + " henkilön tiedot </p>" + "<h3>" +d+ "</h3>"
  res.send(`${str}`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person){
    console.log("hei")
    res.json(person)
  } else {
    console.log(person)
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id =Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (request, response) => {
  var person = request.body
  if (!person.name){
    return response.status(400).json({error: 'Name missing'})
  }if (!person.number){
    return response.status(400).json({error: 'Number missing!'})
  }
  if (persons.find(personName =>  personName.name === person.name)){
    return response.status(400).json({error: 'Name must be unique!'})
  }if (persons.find(personName =>  personName.number === person.number)){
    return response.status(400).json({error: 'Number must be unique!'})
  }
  const id = Math.floor((Math.random() * 1000000) +1)
  
  person.id = id
  if (person.id < 10){                        //Ihan vain ettei kovakoodatut tule
      person.id += Math.floor((Math.random() * 100) +1)
  }

  response.json(person)
})

const port = 3001
app.listen(port)
console.log(`server running on port ${port}`)
