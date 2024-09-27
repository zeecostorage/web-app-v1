// App.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock the fetch function globally
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true, // Simulate a successful response
        json: () => Promise.resolve({ message: 'Thank you for submitting' }), // Mock response body
    })
);

describe('App Component', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock after each test
    });

    test('submits name and age successfully', async () => {
        render(<App />);

        // Input elements
        const nameInput = screen.getByPlaceholderText(/enter your name/i);
        const ageInput = screen.getByPlaceholderText(/enter your age/i);
        const submitButton = screen.getByRole('button', { name: /submit/i });

        // Simulate user typing valid data
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(ageInput, { target: { value: '30' } });
        fireEvent.click(submitButton);

        // Assertions for successful submission
        expect(await screen.findByText(/thank you for submitting/i)).toBeInTheDocument();
    });
});

