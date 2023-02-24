import { setsList } from "../tests/mocks/setsList.mock";
import { ApiCardHelper } from "./apiCardHelpers";

describe('ApiCardHelper', () =>{
    describe('getAllSets', () => {
        global.fetch = jest.fn().mockImplementationOnce(() => 
            Promise.resolve({ json: () => Promise.resolve(setsList)})
        );
        
        it('should return list of sets', async () => {
            const sets = await ApiCardHelper.getAllSets();
            expect(sets).toEqual(setsList);
        })
    })
})