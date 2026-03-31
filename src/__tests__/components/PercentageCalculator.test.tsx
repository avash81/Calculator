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
  test('Type 1: What is X% of Y? (15% of 2500 = 375)', () => {
    render(<PercentageCalculator />);
    
    // The inputs are pre-filled or we can find them by their surrounding text/structure
    // Since labels are visually connected, we find inputs by their value for simplicity in testing
    const inputs = screen.getAllByRole('spinbutton');
    
    // Type 1: Val1 (15) and Val2 (2500)
    fireEvent.change(inputs[0], { target: { value: '15' } });
    fireEvent.change(inputs[1], { target: { value: '2500' } });
    
    // The UI formats 375.toLocaleString() -> "375"
    expect(screen.getByText('375')).toBeInTheDocument();
  });

  test('Type 2: X is what % of Y? (150 is what % of 600 = 25%)', () => {
    render(<PercentageCalculator />);
    const inputs = screen.getAllByRole('spinbutton');
    
    fireEvent.change(inputs[2], { target: { value: '150' } });
    fireEvent.change(inputs[3], { target: { value: '600' } });
    
    expect(screen.getByText('25.00%')).toBeInTheDocument();
  });

  test('Type 3: Find Original Number (375 is 15% of what = 2500)', () => {
    render(<PercentageCalculator />);
    const inputs = screen.getAllByRole('spinbutton');
    
    fireEvent.change(inputs[4], { target: { value: '375' } });
    fireEvent.change(inputs[5], { target: { value: '15' } });
    
    expect(screen.getByText('2,500')).toBeInTheDocument();
  });

  test('Type 4: Percentage Increase (100 to 120 = 20% Increase)', () => {
    render(<PercentageCalculator />);
    const inputs = screen.getAllByRole('spinbutton');
    
    fireEvent.change(inputs[6], { target: { value: '100' } });
    fireEvent.change(inputs[7], { target: { value: '120' } });
    
    expect(screen.getByText('20.00%')).toBeInTheDocument();
    expect(screen.getAllByText('Increase').length).toBeGreaterThan(0);
  });
});
