import { fireEvent, getByLabelText, render, screen } from '@testing-library/react';
import { toBeInTheDocument } from '@testing-library/jest-dom';
import { Header } from './components/Header.js';
import { Balance } from './components/Balance.js';
import { IncomeExpenses } from './components/IncomeExpenses.js';
import { TransactionList } from './components/TransactionList.js';
import { AddTransaction } from './components/AddTransaction.js';
import { GlobalContext } from './context/GlobalState.js';

const mockContextValue = {
    transactions: [
      { id: 1, text: 'Transaction 1', amount: 100 },
      { id: 2, text: 'Transaction 2', amount: -50 },
    ],
    addTransaction: jest.fn(),
    deleteTransaction: jest.fn()
};

test('render Header component correctly', () => {
    render(
        <GlobalContext.Provider value={mockContextValue}>
            <Header />
        </GlobalContext.Provider>
    );

    expect(screen.getByRole('heading', { name: /expense tracker/i })).toBeInTheDocument();
});

test('render Balance component correctly', () => {
    render(
    <GlobalContext.Provider value={mockContextValue}>
        <Balance />
    </GlobalContext.Provider>
    );

    expect(screen.getByRole('heading', { name: /your balance/i })).toBeInTheDocument();
    expect(screen.getByTestId('total-balance')).toHaveTextContent('50');
});

test('render IncomeExpenses component correctly', () => {
    render(
        <GlobalContext.Provider value={mockContextValue}>
            <IncomeExpenses />
        </GlobalContext.Provider>
    );
    
    expect(screen.getByTestId('total-income')).toHaveTextContent('100');
    expect(screen.getByTestId('total-expenses')).toHaveTextContent('50');
});

test('render TransactionList component correctly', () => {
    render(
        <GlobalContext.Provider value={mockContextValue}>
            <TransactionList />
        </GlobalContext.Provider>
    );

    const listitems = screen.getAllByRole('listitem');
    for (let item of listitems)
        expect(item).toBeInTheDocument();

    const buttons = screen.getAllByRole('button', { name: /x/i });
    expect(buttons.length).toBe(2);
});

test('add entered trasactions to the list', () => {
    render(
        <GlobalContext.Provider value={mockContextValue}>
            <AddTransaction />
        </GlobalContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/text/i), { target: { value: 'Test Transaction' }});
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '50'}});

    fireEvent.click(screen.getByText('Add transaction'));

    expect(mockContextValue.addTransaction).toHaveBeenCalled();
});