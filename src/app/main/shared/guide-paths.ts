/**
 * Static mapping from subsubgoal __id → guide.md path (relative to public/).
 *
 * The IDs follow the pattern: {roleId}--{subgoal-slug}--{stepIndex}
 * The guide paths follow: learn/angular-ngrx-firebase/compass/{task}/{subgoalFolder}/{stepFolder}/guide.md
 *
 * Since different compass tasks (greeting, date-time, weekly-goals-header, etc.)
 * all share the same subgoal structure, we pick the first task ("greeting") for
 * Components, and wire the others similarly.
 */

// Greeting task — Components role
const GREETING_ELEMENTS: Record<string, string> = {
    'components--elements--0': 'learn/angular-ngrx-firebase/compass/greeting/01-elements/01-declare-text-elements/guide.md',
    'components--elements--1': 'learn/angular-ngrx-firebase/compass/greeting/01-elements/04-global-styling/guide.md',
    'components--elements--2': 'learn/angular-ngrx-firebase/shared/component/01-elements/c04-intro-to-angular-material/guide.snippets.ts',
    'components--elements--3': 'learn/angular-ngrx-firebase/shared/component/01-elements/e01-use-appropriate-tags/guide.snippets.ts',
    'components--elements--4': 'learn/angular-ngrx-firebase/compass/greeting/01-elements/05-diffs/guide.md',
    'components--elements--5': 'learn/angular-ngrx-firebase/compass/greeting/01-elements/03-style-text/guide.md',
    'components--elements--6': 'learn/angular-ngrx-firebase/shared/component/01-elements/s05-icons-images/guide.snippets.ts',
    'components--elements--7': 'learn/angular-ngrx-firebase/compass/greeting/01-elements/02-add-selectors-colors/guide.md',
    'components--elements--8': 'learn/angular-ngrx-firebase/compass/greeting/01-elements/01-declare-text-elements/guide.md',
};

const GREETING_LAYOUT: Record<string, string> = {
    'components--layout--0': 'learn/angular-ngrx-firebase/compass/greeting/02-layout/04-spacing-between-elements-containers/guide.md',
    'components--layout--1': 'learn/angular-ngrx-firebase/compass/greeting/02-layout/03-size-scrolling/guide.md',
    'components--layout--2': 'learn/angular-ngrx-firebase/shared/component/02-layout/e01-fix-div-containers/guide.snippets.ts',
    'components--layout--3': 'learn/angular-ngrx-firebase/compass/greeting/02-layout/01-direction-wrapping/guide.md',
    'components--layout--4': 'learn/angular-ngrx-firebase/compass/greeting/02-layout/02-style-containers/guide.md',
    'components--layout--5': 'learn/angular-ngrx-firebase/shared/component/02-layout/s05-set-alignment/guide.snippets.ts',
};

const GREETING_DATA: Record<string, string> = {
    'components--data--0': 'learn/angular-ngrx-firebase/shared/component/03-data/c01-intro-to-conditional-binding/guide.snippets.ts',
    'components--data--1': 'learn/angular-ngrx-firebase/shared/component/03-data/c02-intro-to-component-inputs/guide.snippets.ts',
    'components--data--2': 'learn/angular-ngrx-firebase/compass/greeting/03-data/02-hardcode-entity-data/guide.md',
    'components--data--3': 'learn/angular-ngrx-firebase/compass/greeting/03-data/03-add-time-based-state/guide.md',
    'components--data--4': 'learn/angular-ngrx-firebase/shared/component/03-data/s05-adding-collection-bindings/guide.snippets.ts',
    'components--data--5': 'learn/angular-ngrx-firebase/compass/greeting/03-data/01-content-bindings/guide.md',
};

const GREETING_EVENTS: Record<string, string> = {
    'components--events--0': 'learn/angular-ngrx-firebase/shared/component/04-events/c01-intro-to-event-binding/guide.snippets.ts',
    'components--events--1': 'learn/angular-ngrx-firebase/shared/component/04-events/s01-adding-event-bindings/guide.snippets.ts',
    'components--events--2': 'learn/angular-ngrx-firebase/shared/component/04-events/s02-adding-output-emitters/guide.snippets.ts',
};

// Applications role
const APP_SETUP: Record<string, string> = {
    'applications--setup--0': 'learn/angular-ngrx-firebase/shared/application/01-setup/s01-environment-files/guide.snippets.ts',
    'applications--setup--1': 'learn/angular-ngrx-firebase/shared/application/01-setup/s02-create-firebase-project/guide.snippets.ts',
    'applications--setup--2': 'learn/angular-ngrx-firebase/shared/application/01-setup/s03-generate-project/guide.snippets.ts',
};

const APP_ENTITIES: Record<string, string> = {
    'applications--entities--0': 'learn/angular-ngrx-firebase/shared/application/02-entities/s01-identify-entities/guide.snippets.ts',
    'applications--entities--1': 'learn/angular-ngrx-firebase/shared/application/02-entities/s02-key-relationships/guide.snippets.ts',
    'applications--entities--2': 'learn/angular-ngrx-firebase/shared/application/02-entities/s03-define-remaining-properties/guide.snippets.ts',
    'applications--entities--3': 'learn/angular-ngrx-firebase/shared/application/02-entities/s02-key-relationships/guide.snippets.ts',
    'applications--entities--4': 'learn/angular-ngrx-firebase/shared/application/02-entities/s03-define-remaining-properties/guide.snippets.ts',
};

const APP_ROUTES: Record<string, string> = {
    'applications--routes--0': 'learn/angular-ngrx-firebase/shared/application/03-routes/s03-wildcard-routes/guide.snippets.ts',
    'applications--routes--1': 'learn/angular-ngrx-firebase/shared/application/03-routes/s01-generate-pages/guide.snippets.ts',
    'applications--routes--2': 'learn/angular-ngrx-firebase/shared/application/03-routes/s02-activate-auth-guard/guide.snippets.ts',
};

const APP_HIERARCHIES: Record<string, string> = {
    'applications--hierarchies--0': 'learn/angular-ngrx-firebase/shared/application/04-hierarchies/s01-generate-containers-and-components/guide.snippets.ts',
};

// Containers role
const CONTAINER_QUERIES: Record<string, string> = {
    'containers--queries--0': 'learn/angular-ngrx-firebase/compass/greeting/05-queries/01-current-user/guide.md',
    'containers--queries--1': 'learn/angular-ngrx-firebase/shared/container/01-queries/s02-selecting-data/guide.snippets.ts',
    'containers--queries--2': 'learn/angular-ngrx-firebase/shared/container/01-queries/s02-selecting-data/guide.snippets.ts',
    'containers--queries--3': 'learn/angular-ngrx-firebase/shared/container/01-queries/s03-stream-load-entities/guide.snippets.ts',
};

const CONTAINER_ACTIONS: Record<string, string> = {
    'containers--actions--0': 'learn/angular-ngrx-firebase/shared/container/02-actions/s05-batch-writes/guide.snippets.ts',
    'containers--actions--1': 'learn/angular-ngrx-firebase/shared/container/02-actions/s04-optimistic-updates/guide.snippets.ts',
    'containers--actions--2': 'learn/angular-ngrx-firebase/shared/container/02-actions/s01-modifying-database/guide.snippets.ts',
    'containers--actions--3': 'learn/angular-ngrx-firebase/shared/container/02-actions/s02-option-pattern/guide.snippets.ts',
    'containers--actions--4': 'learn/angular-ngrx-firebase/shared/container/02-actions/s05-batch-writes/guide.snippets.ts',
    'containers--actions--5': 'learn/angular-ngrx-firebase/shared/container/02-actions/c01-optimistic-vs-pessimistic/guide.snippets.ts',
};

/** Combined map of all step IDs → guide paths */
export const GUIDE_PATHS: Record<string, string> = {
    ...GREETING_ELEMENTS,
    ...GREETING_LAYOUT,
    ...GREETING_DATA,
    ...GREETING_EVENTS,
    ...APP_SETUP,
    ...APP_ENTITIES,
    ...APP_ROUTES,
    ...APP_HIERARCHIES,
    ...CONTAINER_QUERIES,
    ...CONTAINER_ACTIONS,
};
