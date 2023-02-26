import { render, screen } from "@testing-library/react";
import { CardSuggestions, noMatchesText } from "./CardSuggestions";

const suggestedCardNames = [
    'Test Suggestion 1',
    'Test Suggestion 2',
    'Test Suggestion 3',
]

const selectionHandler = jest.fn();

describe('CardSuggestions component', () => {
    it('should display suggested cards', () => {
        render(<CardSuggestions cards={suggestedCardNames} limit={suggestedCardNames.length} selectionHandler={selectionHandler}/> )
        expect(screen.queryAllByText(/Test Suggestion [0-9]/).length).toEqual(suggestedCardNames.length);
    })

    it('should only display limit', () => {
        const limit = 1
        render(<CardSuggestions cards={suggestedCardNames} limit={limit} selectionHandler={selectionHandler}/> )
        expect(screen.queryAllByText(/Test Suggestion [0-9]/).length).toEqual(limit);
    })

    it('should display no matches text when card suggestions passed are empty', () => {
        render(<CardSuggestions cards={[]} limit={3} selectionHandler={selectionHandler}/> )
        expect(screen.queryAllByText(/Test Suggestion [0-9]/).length).toEqual(0);
        expect(screen.queryByText(noMatchesText)).not.toBeNull();
    })
    
})