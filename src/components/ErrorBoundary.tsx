import { Component, PropsWithChildren, ReactNode } from 'react';

class ErrorBoundary extends Component<PropsWithChildren<{ fallback: ReactNode }>> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    // componentDidCatch(err: Error) {
    //     throw err;
    // }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
