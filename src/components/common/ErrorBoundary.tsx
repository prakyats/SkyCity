'use client';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { reloadPage } from '@/lib/browser';
import { project } from '@/content/project';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * If the page fails, the visitor still gets a way forward: what happened,
 * how to retry, and a phone number that does not depend on this page
 * working at all.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div data-chrome className="min-h-screen flex items-center" style={{ background: 'var(--ink)', color: 'var(--bone)' }}>
        <div className="wrap">
          <p className="t-eyebrow">Something went wrong</p>
          <h2 className="t-display mt-4" style={{ maxWidth: '16ch' }}>
            This page did not finish loading
          </h2>
          <p className="t-body mt-8" style={{ color: 'var(--text-2)', maxWidth: '42ch' }}>
            Reloading usually fixes it. If it does not, call us and we will
            take you through the project directly.
          </p>
          <div className="flex flex-wrap gap-3 mt-10">
            <button onClick={reloadPage} className="btn" style={{ borderColor: 'rgba(247,240,230,0.5)' }}>
              Reload the page
            </button>
            <a href={project.phoneHref} className="btn" style={{ borderColor: 'rgba(247,240,230,0.5)' }}>
              Call {project.phone}
            </a>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="t-ui-sm mt-12 p-4 overflow-auto max-h-40"
              style={{ border: '1px solid var(--line)', color: 'var(--text-2)' }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
