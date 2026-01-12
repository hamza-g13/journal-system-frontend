import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Simple component to test
const TestComponent = () => <div>Hello Test World</div>;

describe('Frontend Basic Tests', () => {
    it('should pass a basic truthy test', () => {
        expect(true).toBe(true);
    });

    it('should render a component', () => {
        render(<TestComponent />);
        expect(screen.getByText('Hello Test World')).toBeInTheDocument();
    });
});
