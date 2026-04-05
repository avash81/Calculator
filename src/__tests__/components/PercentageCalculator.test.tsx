import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import PercentageCalculator from '../../app/calculator/percentage/Calculator';

// Mock Next.js navigation which is used in CalcWrapper/ShareResult
jest.mock('next/navigation', () => ({
  useRouter() {
    return { push: jest.fn(), back: jest.fn() };
  },
  usePathname() {
    return '/calculator/percentage';
  }
}));

describe('Percentage Calculator Accuracy Test Suite', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('Type 1: What is X% of Y? (15% of 2500 = 375)', () => {
    render(<PercentageCalculator />);

    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(2);

    // Type 1: Val1 (15) and Val2 (2500)
    fireEvent.change(inputs[0], { target: { value: '15' } });
    fireEvent.change(inputs[1], { target: { value: '2500' } });
    
    // The UI formats 375.toLocaleString() -> "375"
    expect(screen.getByText('375')).toBeInTheDocument();
  });

  test('Type 2: X is what % of Y? (150 is what % of 600 = 25%)', () => {
    render(<PercentageCalculator />);

    fireEvent.click(
      screen.getByRole('button', { name: /X is \?% of Y/i })
    );

    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(2);

    fireEvent.change(inputs[0], { target: { value: '150' } });
    fireEvent.change(inputs[1], { target: { value: '600' } });

    expect(screen.getByText('25.00%')).toBeInTheDocument();
  });

  test('Type 3: Find Original Number (375 is 15% of what = 2500)', () => {
    render(<PercentageCalculator />);

    fireEvent.click(
      screen.getByRole('button', { name: /X is Y% of \?/i })
    );

    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(2);

    // In "X is Y% of what?" mode:
    // num = percentage (15) and den = current value (375)
    fireEvent.change(inputs[0], { target: { value: '15' } });
    fireEvent.change(inputs[1], { target: { value: '375' } });

    expect(screen.getByText('2,500')).toBeInTheDocument();
  });

  test('Type 4: Percentage Increase (100 to 120 = 20% Increase)', () => {
    render(<PercentageCalculator />);

    fireEvent.click(
      screen.getByRole('button', { name: /% Change/i })
    );

    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(2);

    fireEvent.change(inputs[0], { target: { value: '100' } });
    fireEvent.change(inputs[1], { target: { value: '120' } });

    expect(screen.getByText('+20.00%')).toBeInTheDocument();
    expect(screen.getAllByText(/Increase/i).length).toBeGreaterThan(0);
  });
});
