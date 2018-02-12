const mongoose = require('mongoose')

const url = 'mongodb://puhelinmestari:Akoj@ds113958.mlab.com:13958/puhelinluettelo'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
})

if (!person.name || !person.number){
    Person
    .find({})
    .then(result=> {
        result.forEach(person => {
            console.log(person.name, "  ", person.number)
        })
        mongoose.connection.close()
    })
}else{
    person
    .save()
    .then(response => {
        console.log('lisätään henkilö ', person.name, ' numero ', person.number, ' luetteloon')
        mongoose.connection.close()
    })
}