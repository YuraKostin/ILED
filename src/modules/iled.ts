import {ILED, Initial, Loading, Error, Data, FoldToRenderable, PickDataType} from "../types";

export const initialOf = <I, L = never, E = never, D = never>(initial: I): ILED<I, L, E, D> => ({
    type: 'Initial',
    initial
});

export const loadingOf = <L, I = never, E = never, D = never>(loading: L): ILED<I, L, E, D> => ({
    type: 'Loading',
    loading
});

export const errorOf = <E, I = never, L = never, D = never>(error: E): ILED<I, L, E, D> => ({type: 'Error', error});

export const dataOf = <D, I = never, L = never, E = never>(data: D): ILED<I, L, E, D> => ({type: 'Data', data});

type DetailedFolding<I, L, E, D> = {
    state: ILED<I, L, E, D>;
    onInitial: FoldToRenderable<I> | null;
    onLoading: FoldToRenderable<L> | null;
    onError: FoldToRenderable<E> | null;
    onData: FoldToRenderable<D> | null;
};

export const DetailedFolding = <I, L, E, D>(props: DetailedFolding<I, L, E, D>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.initial) : null;
        case "Loading":
            return props.onLoading ? props.onLoading(props.state.loading) : null;
        case "Error":
            return props.onError ? props.onError(props.state.error) : null;
        case "Data":
            return props.onData ? props.onData(props.state.data) : null;
        default: {
            return type;
        }
    }
};

export const foldValue = <I1, L1, E1, D1, I2, L2, E2, D2>(
    iled: ILED<I1, L1, E1, D1>,
    onInitial: (v: PickDataType<typeof iled, 'Initial'>) => I2,
    onLoading: (v: PickDataType<typeof iled, 'Loading'>) => L2,
    onError: (v: PickDataType<typeof iled, 'Error'>) => E2,
    onData: (v: PickDataType<typeof iled, 'Data'>) => D2,
) => {
    switch (iled.type) {
        case "Initial":
            return onInitial(iled.initial);
        case "Loading":
            return onLoading(iled.loading);
        case "Error":
            return onError(iled.error);
        case "Data":
            return onData(iled.data);
    }
};

interface Endomorphisms<I, L, E, D> {
    initial: Endomorphism<I>,
    loading: Endomorphism<L>,
    error: Endomorphism<E>,
    data: Endomorphism<D>,
}

type Endomorphism<V> = (v: V) => V;

type InferI<T> = T extends ILED<infer I, unknown, unknown, unknown>
    ? I
    : never;

type InferL<T> = T extends ILED<unknown, infer L, unknown, unknown>
    ? L
    : never;

type InferE<T> = T extends ILED<unknown, unknown, infer E, unknown>
    ? E
    : never;

type InferD<T> = T extends ILED<unknown, unknown, unknown, infer D>
    ? D
    : never;

export const endomorphism = <T, I = InferI<T>, L = InferL<T>, E = InferE<T>, D = InferD<T>>(iledValue: ILED<I, L, E, D>, morphisms: Endomorphisms<I, L, E, D>): ILED<I, L, E, D> => {
    if (iledValue.type === 'Initial') {
        return initialOf(morphisms['initial'](iledValue.initial));
    }

    if (iledValue.type === 'Loading') {
        return loadingOf(morphisms['loading'](iledValue.loading));
    }

    if (iledValue.type === 'Error') {
        return errorOf(morphisms['error'](iledValue.error));
    }

    return dataOf(morphisms['data'](iledValue.data));
};

export const initialEndomorphism = <T, I = InferI<T>, L = InferL<T>, E = InferE<T>, D = InferD<T>>(iledValue: ILED<I, L, E, D>, morphism: Endomorphisms<I, L, E, D>['initial']): ILED<I, L, E, D> => {
    if (iledValue.type === 'Initial') {
        return initialOf(morphism(iledValue.initial));
    }

    return iledValue;
};

export const loadingEndomorphism = <T, I = InferI<T>, L = InferL<T>, E = InferE<T>, D = InferD<T>>(iledValue: ILED<I, L, E, D>, morphism: Endomorphisms<I, L, E, D>['loading']): ILED<I, L, E, D> => {
    if (iledValue.type === 'Loading') {
        return loadingOf(morphism(iledValue.loading));
    }

    return iledValue;
};

export const errorEndomorphism = <T, I = InferI<T>, L = InferL<T>, E = InferE<T>, D = InferD<T>>(iledValue: ILED<I, L, E, D>, morphism: Endomorphisms<I, L, E, D>['error']): ILED<I, L, E, D> => {
    if (iledValue.type === 'Error') {
        return errorOf(morphism(iledValue.error));
    }

    return iledValue;
};

export const dataEndomorphism = <T, I = InferI<T>, L = InferL<T>, E = InferE<T>, D = InferD<T>>(iledValue: ILED<I, L, E, D>, morphism: Endomorphisms<I, L, E, D>['data']): ILED<I, L, E, D> => {
    if (iledValue.type === 'Data') {
        return dataOf(morphism(iledValue.data));
    }

    return iledValue;
};