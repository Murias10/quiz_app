import { QuestionModel } from '../src/models/question-model';
import { getWikidataSparql } from '@entitree/helper';
import { generateQuestions } from '../src/services/question-generator';

// INTO A DIFFERENT FILE TO AVOID MOCKS COLLIDING WITH EACH OTHER

// Mocking: QuestionModel.aggregate()
// Avoiding flakiness of DB calls
jest.mock("../src/models/question-model")

// Mocking: getWikidataSparql()
// Avoiding flakiness of API calls
jest.mock("@entitree/helper")

describe("Question Service - Question Generator", () => {

    beforeEach( () =>{
        jest.clearAllMocks()
    })

    const numberQuestions = 1

    it("should return 1 question when generator succeeds", async () => {

        // Mock response for fetching MongoDB documents
        const mockResponseAggregate: object[] = [{
            questionTemplate: 'What is the Capital of $$$ ?',
            question_type: {
                name: 'Capitals',
                query: `SELECT ?templateLabel ?answerLabel
                        WHERE {
                        ?template wdt:P31 wd:$$$; # Entity
                        wdt:P36 ?answer.  # Capital
                        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,es"}
                        }
                        ORDER BY UUID() # Add randomness to the results
                        LIMIT 10`,
                entities: [
                    'Q6256', 
                    'Q10742',
                ],
            }
        }]; 
        (QuestionModel.aggregate as jest.Mock).mockReturnValue(mockResponseAggregate)

        // Mock response for Wikidata call
        const mockResponseWikidata = [{
            templateLabel: "Peru",
            answerLabel: "Lima"
        },{
            templateLabel: "Spain",
            answerLabel: "Madrid"
        },{
            templateLabel: "Russia",
            answerLabel: "Moscow"
        },{
            templateLabel: "Ucrania",
            answerLabel: "Kiev"
        }];
        (getWikidataSparql as jest.Mock).mockReturnValue(mockResponseWikidata)

        const response = await generateQuestions(numberQuestions) as object[]

        expect(QuestionModel.aggregate).toHaveBeenCalledWith([
            { $sample: { size: numberQuestions } },
          ]);
        expect(response.length).toBe(numberQuestions)
    })

    it("should return 1 question with all correct parameters when generator succeeds", async () => {

        // Mock response for fetching MongoDB documents
        const mockResponseAggregate: object[] = [{
            questionTemplate: 'What is the Capital of $$$ ?',
            question_type: {
                name: 'Capitals',
                query: `SELECT ?templateLabel ?answerLabel
                        WHERE {
                        ?template wdt:P31 wd:$$$; # Entity
                        wdt:P36 ?answer.  # Capital
                        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,es"}
                        }
                        ORDER BY UUID() # Add randomness to the results
                        LIMIT 10`,
                entities: [
                    'Q6256', 
                    'Q10742',
                ],
            }
        }]; 
        (QuestionModel.aggregate as jest.Mock).mockReturnValue(mockResponseAggregate)

        // Mock response for Wikidata call
        const mockResponseWikidata = [{
            templateLabel: "Peru",
            answerLabel: "Lima"
        },{
            templateLabel: "Spain",
            answerLabel: "Madrid"
        },{
            templateLabel: "Russia",
            answerLabel: "Moscow"
        },{
            templateLabel: "Ucrania",
            answerLabel: "Kiev"
        }];
        (getWikidataSparql as jest.Mock).mockReturnValue(mockResponseWikidata)

        const response = await generateQuestions(numberQuestions) as any

        expect(QuestionModel.aggregate).toHaveBeenCalledWith([
            { $sample: { size: numberQuestions } },
          ]);

        expect(response[0]).toHaveProperty("id") // a given id
        expect(response[0]).toHaveProperty("question") // the generated question
        expect(response[0]).toHaveProperty("answers") // a list of answers
        expect(response[0].answers.length).toBe(4) // 4 answers
        expect(response[0]).toHaveProperty("correctAnswerId", 1) // a correct answer Id set to 1
    })

    
    it("should return an error if fetching documents from Mongo fails", async () => {

        // Mock response for fetching MongoDB documents
        const rejectedMongoResponse = new Error("Mock - Error fetching Questions");
        (QuestionModel.aggregate as jest.Mock).mockRejectedValue(rejectedMongoResponse);

        // Expect that aggregate function rejected with the rejectedMongoResponse
        await expect( generateQuestions(numberQuestions) ).rejects.toThrow("Mock - Error fetching Questions");
        
    })

    
    it("should return an error if calling wikidata fails", async () => {

        // Mock response for fetching MongoDB documents
        const mockResponseAggregate: object[] = [{
            questionTemplate: 'What is the Capital of $$$ ?',
            question_type: {
                name: 'Capitals',
                query: `SELECT ?templateLabel ?answerLabel
                        WHERE {
                        ?template wdt:P31 wd:$$$; # Entity
                        wdt:P36 ?answer.  # Capital
                        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,es"}
                        }
                        ORDER BY UUID() # Add randomness to the results
                        LIMIT 10`,
                entities: [
                    'Q6256', 
                    'Q10742',
                ],
            }
        }]; 
        (QuestionModel.aggregate as jest.Mock).mockReturnValue(mockResponseAggregate)

        // Mock response for Wikidata call
        const rejectedWikidataResponse = new Error("Mock - Error from Wikidata");
        (getWikidataSparql as jest.Mock).mockRejectedValue(rejectedWikidataResponse)

        // Expect that Wikidata call function rejected with the rejectedWikidataResponse
        await expect( generateQuestions(numberQuestions) ).rejects.toThrow("Mock - Error from Wikidata");
        
 
    })
    



})