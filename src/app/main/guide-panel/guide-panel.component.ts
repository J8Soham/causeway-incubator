import { Component, ChangeDetectionStrategy, input, output, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subsubgoal } from 'src/app/core/store/subsubgoal/subsubgoal.model';
import { GUIDE_PATHS } from '../shared/guide-paths';

@Component({
    selector: 'app-guide-panel',
    templateUrl: './guide-panel.component.html',
    styleUrls: ['./guide-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
    ],
})
export class GuidePanelComponent {
    private readonly http = inject(HttpClient);

    // --------------- INPUTS AND OUTPUTS ------------------

    /** The step to display the guide for. */
    step = input.required<Subsubgoal>();

    /** Emits when the panel should close. */
    closed = output<void>();

    // --------------- LOCAL UI STATE ----------------------

    /** The guide content as HTML. */
    guideHtml = signal('');

    /** Loading state. */
    loading = signal(true);

    /** Error message. */
    error = signal('');

    // --------------- COMPUTED DATA -----------------------

    /** The guide file path for this step. */
    guidePath = computed(() => GUIDE_PATHS[this.step().__id] || '');

    /** Whether this is a .ts snippets file (not markdown). */
    isSnippetsFile = computed(() => this.guidePath().endsWith('.ts'));

    // --------------- LIFECYCLE --------------------------

    constructor() {
        effect(() => {
            const path = this.guidePath();
            if (!path) {
                this.loading.set(false);
                this.error.set('No guide available for this step yet.');
                return;
            }

            this.loading.set(true);
            this.error.set('');

            this.http.get(path, { responseType: 'text' }).subscribe({
                next: (content) => {
                    if (this.isSnippetsFile()) {
                        // For .ts snippet files, wrap in a code block
                        this.guideHtml.set(this.renderSnippets(content));
                    } else {
                        // For .md files, convert markdown to HTML
                        this.guideHtml.set(this.renderMarkdown(content));
                    }
                    this.loading.set(false);
                },
                error: () => {
                    this.error.set('Failed to load guide content.');
                    this.loading.set(false);
                },
            });
        }, { allowSignalWrites: true });
    }

    // --------------- METHODS ----------------------------

    /** Close the panel. */
    close() {
        this.closed.emit();
    }

    /** Simple markdown-to-HTML converter. */
    private renderMarkdown(md: string): string {
        return md
            // Code blocks (```lang ... ```)
            .replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) => {
                const escaped = this.escapeHtml(code.trim());
                return `<pre><code class="language-${lang}">${escaped}</code></pre>`;
            })
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Headers
            .replace(/^### (.+)$/gm, '<h4>$1</h4>')
            .replace(/^## (.+)$/gm, '<h3>$1</h3>')
            .replace(/^# (.+)$/gm, '<h2>$1</h2>')
            // Bold and italic
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // Line breaks: double newlines → paragraphs
            .replace(/\n\n/g, '</p><p>')
            // Single newlines → <br>
            .replace(/\n/g, '<br>')
            // Wrap in paragraph
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');
    }

    /** Render .ts snippet files as formatted code. */
    private renderSnippets(content: string): string {
        const escaped = this.escapeHtml(content);
        return `<pre><code class="language-typescript">${escaped}</code></pre>`;
    }

    /** Escape HTML characters. */
    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}
