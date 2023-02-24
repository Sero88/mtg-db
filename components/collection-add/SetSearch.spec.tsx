import {act, render, screen} from '@testing-library/react'
import {SetSearch} from './SetSearch'
import {ApiCardHelper} from '../../util/apiCardHelpers';
import { setHelper } from '../../util/sets';
import { setsList } from '../../tests/mocks/setsList.mock';

const selectedSet = 'test';
const setChangeHandler = jest.fn();

jest.spyOn(ApiCardHelper,'getAllSets').mockImplementation(() => Promise.resolve({data:setsList}))
jest.spyOn(setHelper, 'isAllowedSearchSet').mockImplementation( () => true );


describe('NameSearch Component', () => {
    it('should display list of sets', async () => {

        await act(async () => {
          render(<SetSearch selectedSet={selectedSet} setChangeHandler={setChangeHandler} /> )
        });

        expect(screen.queryAllByText(/^Set Name [0-9]?/).length).toEqual(2)
    })
})