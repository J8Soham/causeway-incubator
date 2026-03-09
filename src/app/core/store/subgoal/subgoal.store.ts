import { inject, effect, WritableSignal } from '@angular/core';
import { signalStore, withState, withMethods } from '@ngrx/signals';
import { withEntities, removeEntity, updateEntity, setEntity, removeEntities, setEntities } from '@ngrx/signals/entities';
import { EntityLoadQuery, EntityStreamQuery, selectEntities, processLoadQueries, withEntitiesAndDBMethods } from 'src/app/core/store/app.store';
import { QueryParams, QueryOptions, AnyEntity } from 'src/app/core/store/app.model';
import { Subgoal } from './subgoal.model';

export class LoadSubgoal extends EntityLoadQuery<Subgoal> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    loadQueries?: (entity: Subgoal) => EntityLoadQuery<AnyEntity>[],
  ) {
    super('subgoals', store, queryParams, queryOptions, loadQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, loadQueries?: (entity: Subgoal) => EntityLoadQuery<AnyEntity>[]): LoadSubgoal {
    return new LoadSubgoal(store, queryParams, queryOptions, loadQueries);
  }
}

export class StreamSubgoal extends EntityStreamQuery<Subgoal> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    streamQueries?: (entity: Subgoal) => EntityStreamQuery<AnyEntity>[],
  ) {
    super('subgoals', store, queryParams, queryOptions, streamQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, streamQueries?: (entity: Subgoal) => EntityStreamQuery<AnyEntity>[]): StreamSubgoal {
    return new StreamSubgoal(store, queryParams, queryOptions, streamQueries);
  }
}

export const SubgoalStore = signalStore(
  { providedIn: 'root' },
  withEntitiesAndDBMethods<Subgoal>('subgoals'),
);
