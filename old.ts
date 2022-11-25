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


// Eksempel 1: Record med gitte keys og verdier av ulik type -- Den gamle måten

type PersonKeys = "firstName" | "lastName" | "address" | "age";


const getFullName = (firstName: string, lastName: string) =>
    `${firstName} ${lastName}`


const logFullNameAndBirthYear = (fullName: string, birthYear: number) =>
    console.log({ fullName, birthYear })


const person: Record<PersonKeys, string | number> = {
    firstName: "Martin",
    lastName: "Wahlberg",
    address: "Rubina Ranas gate 7",
    age: 29
}

//Oisann! Her ble det litt feil
const personFullNameWithError = getFullName(person.firstName, person.lastName);
const birthYearWithError = new Date().getFullYear() - person.age


const personsFullNameFixed =
    typeof person.firstName === "string" &&
    typeof person.lastName === "string" &&
    getFullName(person.firstName, person.lastName)

const birthYearFixed =
    typeof person.age === "number" &&
    new Date().getFullYear() - person.age

//Oi! personsFullNameFixed og birthYearFixed kan visst være false nå
logFullNameAndBirthYear(personsFullNameFixed, birthYearFixed)

if (personsFullNameFixed && birthYearFixed) {
    //Endelig i mål!
    logFullNameAndBirthYear(personsFullNameFixed, birthYearFixed)
}


// Satisfies eksempel 2: Bedre kontroll på konstanter (Eksempel fra virkeligheten)

interface Person {
    name: string;
    telephoneNumber: string;
    nationality: string;
    telephoneConcent: boolean;
}


const getFields = (person: Person) => {
    // TODO: Change 'as const' to 'satisfies (keyof Person)[] when typescript 4.9 is released'
    const fieldKeys = ["name", 'telephoneNumber', 'telephoneConcent'] as const

    return fieldKeys.reduce<{ fieldText: string, value: string }[]>((fields, currentFieldKey) => {
        if (currentFieldKey === "name") {
            return [...fields, {
                fieldText: "Navn:",
                value: person.name
            }]
        }

        if (currentFieldKey === "telephoneConcent") {

            return [...fields, {
                fieldText: "Jeg samtykker til å bli kontaktet på telefon:",
                value: person.telephoneConcent ? "Ja" : "Nei"
            }]

        }

        if (currentFieldKey === "telephoneNumber" && person.telephoneConcent) {
            return [...fields, {
                fieldText: "Telefon:",
                value: person.telephoneNumber
            }]
        }

        return fields
    }, [])
}

// Satisfies eksempel 2: Bedre kontroll på konstanter (Det kunne gått verre)
const scaryExample = (personKey: keyof Person) => {
    const personFieldKeys = ["name", 'telephoneNumber', 'telephoneConcent'] as const

    return personFieldKeys.map(fieldKey => {
        if (fieldKey === personKey) {
            // Gjør noe viktig
            console.log("👩‍💻👨‍💻👩‍💻")
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
    if (isBicycle(transportMethod)) {
        transportMethod.pedal()
    } else {
        transportMethod.accelerate()
    }
}

//Unlisted property narrowing eksempel 2: Sikrere typeguards.
const isBicycle = (transportMethod: TransportMethod): transportMethod is Bicycle => "pedal" in transportMethod;

//Unlisted property narrowing eksempel 3: Infere typer fra utypede felter

interface PoorlyTypedObject { name: string }

interface CorrectlyTypedObject extends PoorlyTypedObject {
    necessaryId: string;
    necessaryFunction: (importantHiddenId: string) => void
}

const isCorrectlyTypedObject = (poorlyTypedObject: PoorlyTypedObject): poorlyTypedObject is CorrectlyTypedObject => "necessaryId" in poorlyTypedObject && "necessaryFunction" in poorlyTypedObject

const poorlyTypedObject = {
    name: "Enter names",
    necessaryId: "123",
    necessaryFunction: (importantHiddenId: string) => console.log(importantHiddenId)
} as PoorlyTypedObject

// Ikke tilgang til hverken necessaryFunction eller necessaryId
poorlyTypedObject.necessaryFunction(poorlyTypedObject.necessaryId)

if (isCorrectlyTypedObject(poorlyTypedObject)) {
    poorlyTypedObject.necessaryFunction(poorlyTypedObject.necessaryId)
}

