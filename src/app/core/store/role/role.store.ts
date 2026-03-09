import { inject, effect, WritableSignal } from '@angular/core';
import { signalStore, withState, withMethods } from '@ngrx/signals';
import { withEntities, removeEntity, updateEntity, setEntity, removeEntities, setEntities } from '@ngrx/signals/entities';
import { EntityLoadQuery, EntityStreamQuery, selectEntities, processLoadQueries, withEntitiesAndDBMethods } from 'src/app/core/store/app.store';
import { QueryParams, QueryOptions, AnyEntity } from 'src/app/core/store/app.model';
import { Role } from './role.model';

export class LoadRole extends EntityLoadQuery<Role> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    loadQueries?: (entity: Role) => EntityLoadQuery<AnyEntity>[],
  ) {
    super('roles', store, queryParams, queryOptions, loadQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, loadQueries?: (entity: Role) => EntityLoadQuery<AnyEntity>[]): LoadRole {
    return new LoadRole(store, queryParams, queryOptions, loadQueries);
  }
}

export class StreamRole extends EntityStreamQuery<Role> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    streamQueries?: (entity: Role) => EntityStreamQuery<AnyEntity>[],
  ) {
    super('roles', store, queryParams, queryOptions, streamQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, streamQueries?: (entity: Role) => EntityStreamQuery<AnyEntity>[]): StreamRole {
    return new StreamRole(store, queryParams, queryOptions, streamQueries);
  }
}

export const RoleStore = signalStore(
  { providedIn: 'root' },
  withEntitiesAndDBMethods<Role>('roles'),
);
