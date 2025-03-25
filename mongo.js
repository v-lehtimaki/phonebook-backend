const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Give password as argument!')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@fullstackcourse.7pvwe.mongodb.net/peopleApp?
retryWrites=true&w=majority&appName=fullstackCourse`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log(`Phonebook:`)
        result.forEach(person => {
            console.log(`${person.name} ${person.phoneNumber}`)
        })
        mongoose.connection.close()
    })
} else {

    const name = process.argv[3]
    const phoneNumber = process.argv[4]

    console.log(`Name: ${name}`);
    console.log(`PhoneNumber: ${phoneNumber}`);
    

    const person = new Person({
        name: name,
        phoneNumber: phoneNumber
    })

    person.save().then(result => {
        console.log(`Added ${result.name} number ${result.phoneNumber} to phonebook.`)
        mongoose.connection.close()
    })
}
