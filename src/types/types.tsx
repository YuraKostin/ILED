import * as React from 'react';

export type Initial<T> = { type: "Initial"; data: T };
export type Loading<T> = { type: "Loading"; data: T };
export type Error<T> = { type: "Error"; data: T };
export type Data<T> = { type: "Data"; data: T };

export type IL<I, L> = Initial<I> | Loading<L>;
export type IE<I, E> = Initial<I> | Error<E>;
export type ID<I, D> = Initial<I> | Data<D>;

export type ILE<I, L, E> = Initial<I> | Loading<L> | Error<E>;
export type ILD<I, L, D> = Initial<I> | Loading<L> | Data<D>;
export type IED<I, E, D> = Initial<I> | Error<E> | Data<D>;

export type ILED<I, L, E, D> = Initial<I> | Loading<L> | Error<E> | Data<D>;

export type FoldToRenderable<T> = (data: T) => JSX.Element | null;
