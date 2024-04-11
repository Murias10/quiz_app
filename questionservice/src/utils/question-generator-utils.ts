import { getWikidataSparql } from '@entitree/helper';

/**
 * Interface for a question which may or not contain an image
 */
interface Question {
    question: string,
    answers: object[],
    correctAnswerId: number,
    image?: string
}

/**
 * Gets a random item from an array
 * @param array 
 * @returns A random item from the array
 */
function getRandomItem<T>(array: T[]): T {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

/**
 * Enhanced Sparql method that adds a timeout to the API call using Promise.race()
 * With this approach, we either obtain the wikidataResponse or an Error stating
 * that the timeout has exceeded. This way, the Question Service will never be
 * kept on hold by waiting the response in case some queries last too long.
 * 
 * @param sparqlQuery the query to prompt into Wikidata Sparql service.
 * @param requestTimeout the timeout in MS for the Service to respond
 * @returns A promise with the aforementioned functionality. 
 */
async function getWikidataSparqlWithTimeout(sparqlQuery: string, requestTimeout: number): Promise<any> {

    // Promise 1: Prompt to Sparql service
    const wikidataPromise = getWikidataSparql(sparqlQuery);

    // Promise 2: Timer
    const timeoutPromise = new Promise((_, reject) => {

        // If timer is exceeded, an error is thrown
        setTimeout(() => reject(new Error("Timeout exceeded for query: " + sparqlQuery)),
            requestTimeout)

    })

    // Promise.race() => Group an array of Promises into a single one. The result of
    // this new promise is the result of ANY of the promises given.
    return Promise.race([wikidataPromise, timeoutPromise])
}

/**
 *  Takes the elements of an array and changes them to a random order
 * @param array 
 * @returns 
 */
function shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Formats a number to a string with dots as thousands separators and a comma as decimal separator
 * @param number The number to format
 * @returns The formatted number 
*/
function getFormatedNumber(number: string): string {
    let parsedNumber = Number(number);

    // Numbers lower than 1 are not modified
    if (parsedNumber <= 1) {
        return number;
    }
    // The number is an integer
    let isInteger = Number.isInteger(parsedNumber)
    if (isInteger && parsedNumber < 10000) {
        return number;
    }

    if (isInteger) {
        return parsedNumber.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    // The number is a float
    else {
        // Split the number into integer and decimal parts
        let [integerPart, decimalPart] = parsedNumber.toFixed(2).toString().split(".");

        // Add dots as thousands separators to the integer part
        let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        let formattedNumber = `${formattedIntegerPart},${decimalPart}`;

        return formattedNumber;
    }
}

function validateAnswersNumbers(questionsArray: any[]) {
    for (const question of questionsArray) {
        for (const answer of question.answers) {
            if (!isNaN(answer.text)) {
                answer.text = getFormatedNumber(answer.text);
            }
        }
    }
}


export { getRandomItem, getWikidataSparqlWithTimeout, shuffleArray, Question, validateAnswersNumbers }