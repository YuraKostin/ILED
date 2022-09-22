export type Initial<T> = {
    readonly type: "Initial";
    readonly data: T
};
export type Loading<T> = {
    readonly type: "Loading";
    readonly data: T
};
export type Error<T> = {
    readonly type: "Error";
    readonly data: T
};
export type Data<T> = {
    readonly type: "Data";
    readonly data: T
};

export type IL<I, L> = Initial<I> | Loading<L>;
export type IE<I, E> = Initial<I> | Error<E>;
export type ID<I, D> = Initial<I> | Data<D>;

export type ILE<I, L, E> = Initial<I> | Loading<L> | Error<E>;
export type ILD<I, L, D> = Initial<I> | Loading<L> | Data<D>;
export type IED<I, E, D> = Initial<I> | Error<E> | Data<D>;

export type ILED<I, L, E, D> = Initial<I> | Loading<L> | Error<E> | Data<D>;

export type FoldToRenderable<T> = (data: T) => JSX.Element | null;

type ALL
    = IL<unknown, unknown>
    | IE<unknown, unknown>
    | ID<unknown, unknown>
    | ILE<unknown, unknown, unknown>
    | ILD<unknown, unknown, unknown>
    | IED<unknown, unknown, unknown>
    | ILED<unknown, unknown, unknown, unknown>;

export type PickType<S extends ALL, T extends S['type']> = Extract<S, { type: T }>;
export type PickDataType<S extends ALL, T extends S['type']> = Extract<S, { type: T }>['data'];
