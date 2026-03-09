import { Component, ChangeDetectionStrategy, inject, signal, computed, effect, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavbarComponent } from 'src/app/shared/navbar/navbar.component';
import { SubsubgoalStore } from 'src/app/core/store/subsubgoal/subsubgoal.store';
import { SubgoalStore } from 'src/app/core/store/subgoal/subgoal.store';
import { RoleStore } from 'src/app/core/store/role/role.store';
import { Subsubgoal, StepType } from 'src/app/core/store/subsubgoal/subsubgoal.model';
import { GUIDE_PATHS } from '../shared/guide-paths';

@Component({
    selector: 'app-learn',
    templateUrl: './learn.component.html',
    styleUrls: ['./learn.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NavbarComponent,
        RouterModule,
        HttpClientModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
    ],
})
export class LearnComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly http = inject(HttpClient);
    private readonly subsubgoalStore = inject(SubsubgoalStore);
    private readonly subgoalStore = inject(SubgoalStore);
    private readonly roleStore = inject(RoleStore);

    // --------------- LOCAL UI STATE ----------------------

    /** The step data. */
    step = signal<Subsubgoal | null>(null);

    /** The guide content as HTML. */
    guideHtml = signal('');

    /** Loading state. */
    loading = signal(true);

    /** Error message. */
    error = signal('');

    // --------------- COMPUTED DATA -----------------------

    /** Whether this step is a concept or task type. */
    stepType = computed(() => {
        const s = this.step();
        if (!s) return '';
        switch (s.type) {
            case StepType.CONCEPT: return 'Concept';
            case StepType.TASK: return 'Task';
            case StepType.REVIEW: return 'Review';
            default: return 'Step';
        }
    });

    /** Type icon. */
    typeIcon = computed(() => {
        const s = this.step();
        if (!s) return 'circle';
        switch (s.type) {
            case StepType.CONCEPT: return 'lightbulb';
            case StepType.TASK: return 'code';
            case StepType.REVIEW: return 'rate_review';
            default: return 'circle';
        }
    });

    /** Type color. */
    typeColor = computed(() => {
        const s = this.step();
        if (!s) return '#5f6368';
        switch (s.type) {
            case StepType.CONCEPT: return '#1a73e8';
            case StepType.TASK: return '#34a853';
            case StepType.REVIEW: return '#ea4335';
            default: return '#5f6368';
        }
    });

    /** Parent subgoal name. */
    subgoalName = computed(() => {
        const s = this.step();
        if (!s) return '';
        const subgoal = this.subgoalStore.selectEntity(s.__subgoalId);
        return subgoal?.name || '';
    });

    /** Parent role name. */
    roleName = computed(() => {
        const s = this.step();
        if (!s) return '';
        const subgoal = this.subgoalStore.selectEntity(s.__subgoalId);
        if (!subgoal) return '';
        const role = this.roleStore.selectEntity(subgoal.__roleId);
        return role?.name || '';
    });

    /** Role color for the accent strip. */
    roleColor = computed(() => {
        const s = this.step();
        if (!s) return '#5f6368';
        const subgoal = this.subgoalStore.selectEntity(s.__subgoalId);
        if (!subgoal) return '#5f6368';
        const role = this.roleStore.selectEntity(subgoal.__roleId);
        return role?.color || '#5f6368';
    });

    /** Whether this is a .ts snippets file. */
    isSnippetsFile = computed(() => {
        const s = this.step();
        if (!s) return false;
        const path = GUIDE_PATHS[s.__id];
        return path ? path.endsWith('.ts') : false;
    });

    // --------------- LIFECYCLE --------------------------

    ngOnInit(): void {
        const stepId = this.route.snapshot.paramMap.get('stepId');
        if (!stepId) {
            this.error.set('No step specified.');
            this.loading.set(false);
            return;
        }

        // Find the step in the store
        const step = this.subsubgoalStore.selectEntity(stepId);
        if (!step) {
            this.error.set('Step not found.');
            this.loading.set(false);
            return;
        }
        this.step.set(step);

        // Fetch the guide content
        const guidePath = GUIDE_PATHS[stepId];
        if (!guidePath) {
            this.error.set('No guide content available for this step yet.');
            this.loading.set(false);
            return;
        }

        this.http.get(guidePath, { responseType: 'text' }).subscribe({
            next: (content) => {
                if (guidePath.endsWith('.ts')) {
                    this.guideHtml.set(this.renderSnippets(content));
                } else {
                    this.guideHtml.set(this.renderMarkdown(content));
                }
                this.loading.set(false);
            },
            error: () => {
                this.error.set('Failed to load guide content.');
                this.loading.set(false);
            },
        });
    }

    // --------------- EVENT HANDLING ----------------------

    /** Navigate back to the home page. */
    goBack() {
        this.router.navigate(['/home']);
    }

    // --------------- PRIVATE METHODS --------------------

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
