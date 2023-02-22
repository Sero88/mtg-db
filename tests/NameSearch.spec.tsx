import {fireEvent, render, screen} from '@testing-library/react'
import {NameSearch} from '../components/collection-add/NameSearch'

const testSearchText = 'test';
const searchTextHandler = jest.fn();

describe('NameSearch Component', () => {
    it('should display search text', () => {
  
        render(<NameSearch searchText={testSearchText} searchTextChange={searchTextHandler}  />);
        const nameField = screen.queryByDisplayValue(testSearchText) as HTMLInputElement

        expect(nameField).not.toBeNull();
        expect(nameField.value).toEqual(testSearchText)
    })

    it('should use the passed searchHandler when values change', () => {
        render(<NameSearch searchText={testSearchText} searchTextChange={searchTextHandler}  />);
        const nameField = screen.queryByDisplayValue(testSearchText) as HTMLInputElement

        fireEvent.change(nameField, {target:{value:'new'}})
        expect(searchTextHandler).toHaveBeenCalled();
    })
    
    
})