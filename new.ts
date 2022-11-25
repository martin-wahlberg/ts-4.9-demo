export { }
/**
 * Satisfies!
 * Ny operator i typescript som lar deg sjekke om et
 * objekt tilfredstiller en gitt type men samtidig lar deg
 * bruke den typen som ellers ville ha blitt inferet av typescript.
 * Veldig nyttig i tilfeller hvor du har en type som skal kunne
 * akseptere ulike typer verdier men hvor du også har behov for å 
 * snevre inn typen for noe du har definert.
 */


// Satisfies eksempel 1: Record med gitte keys og verdier av ulik type -- Den nye måten

type PersonKeys = "firstName" | "lastName" | "age";


const getFullName = (firstName: string, lastName: string) =>
    `${firstName} ${lastName}`


const logFullNameAndBirthYear = (fullName: string, birthYear: number) =>
    console.log({ fullName, birthYear })


const person = {
    firstName: "Martin",
    lastName: "Wahlberg",
    age: 29
}  satisfies Record<PersonKeys, string | number >

const personFullName = getFullName(person.firstName, person.lastName);
const birthYear = new Date().getFullYear() - person.age

logFullNameAndBirthYear(personFullName, birthYear)


// Satisfies eksempel 2: Bedre kontroll på konstanter (Eksempel fra virkeligheten)

interface Person {
    name: string;
    telephoneNumber: string;
    nationality: string;
    hasTelephoneConcent: boolean;
}


const getFields = (person: Person) => {
    // TODO: Change 'as const' to 'satisfies (keyof Person)[] when typescript 4.9 is released'
    const fieldKeys = ["name", 'telephoneNumber', 'hasTelephoneConcent']satisfies (keyof Person)[]

    return fieldKeys.reduce<{ fieldText: string, value: string }[]>((fields, currentFieldKey) => {
        if (currentFieldKey === "name") {
            return [...fields, {
                fieldText: "Navn:",
                value: person.name
            }]
        }

        if (currentFieldKey === "hasTelephoneConcent") {

            return [...fields, {
                fieldText: "Jeg samtykker til å bli kontaktet på telefon:",
                value: person.hasTelephoneConcent ? "Ja" : "Nei"
            }]

        }

        if (currentFieldKey === "telephoneNumber" && person.hasTelephoneConcent) {
            return [...fields, {
                fieldText: "Telefon:",
                value: person.telephoneNumber
            }]
        }

        return fields
    }, [])
}

// Satisfies eksempel 3: Bedre kontroll på konstanter (Det kunne gått verre)
const getMessage = (personKey: keyof Person) => {
    const personFieldKeys = ["name", 'telephoneNumber', 'hasTelephoneConcent']satisfies (keyof Person)[]


    return personFieldKeys.map(fieldKey => {
        if (fieldKey === personKey) {
            // Legg til noe viktig
            return {
                message: "Something is very wrong!"
            }
        }
        return {
            message: "Everything is ok :)"
        }

    })
}


/**
 * Unlisted property narrowing!
 * Gjøre det mulig å bruke "in" operatoren til å snevre inn både union typer.
 * Og infere typer fra utypede felter i objekter.
 * Vil bidra til å gjøre mange typeguards unødvendige
 */


interface Bicycle {
    pedal: () => void
}

interface Car {
    accelerate: () => void
}

type TransportMethod = Bicycle | Car

//Unlisted property narrowing eksempel 1: Innsnevring av union type.
const getToWork = (transportMethod: TransportMethod) => {
    if ("pedal" in transportMethod) {
        transportMethod.pedal()
    } else {
        transportMethod.accelerate()
    }
}

//Unlisted property narrowing eksempel 2: Sikrere typeguards.
const isBicycle = (transportMethod: TransportMethod): transportMethod is Bicycle => "pedal" in transportMethod && typeof transportMethod.pedal === "function"

//Unlisted property narrowing eksempel 3: Infere typer fra utypede felter
const poorlyTypedObject = {
    name: "Enter names",
    necessaryId: "123",
    necessaryFunction: (importantHiddenId: string) => console.log(importantHiddenId)
} as { name: string }

if ("necessaryId" in poorlyTypedObject &&
    typeof poorlyTypedObject.necessaryId === "string") {
    console.log(poorlyTypedObject.necessaryId)

    if ("necessaryFunction" in poorlyTypedObject && typeof poorlyTypedObject.necessaryFunction === "function") {
        poorlyTypedObject.necessaryFunction(poorlyTypedObject.necessaryId)
    }
}



