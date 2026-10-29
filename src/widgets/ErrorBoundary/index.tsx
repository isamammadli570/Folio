import {Component, type ErrorInfo, type ReactNode} from "react";
import i18n from "@/i18n";
import {Button} from "@/components/ui/button";

type ErrorBoundaryProps = {children: ReactNode};
type ErrorBoundaryState = {hasError: boolean};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = {hasError: false};

    static getDerivedStateFromError(): ErrorBoundaryState {
        return {hasError: true};
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        console.error("Unhandled UI error", error, info.componentStack);
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div role="alert" className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
                <h1 className="font-serif text-2xl">{i18n.t("common:errors.generic")}</h1>
                <Button variant="outline" onClick={() => window.location.reload()}>{i18n.t("common:actions.retry")}</Button>
            </div>
        );
    }
}
