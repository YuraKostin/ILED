import {ILE} from "../types";

export const initialOf = <I, L = never, E = never, D = never>(initial: I): ILE<I, L, E> => ({type: 'Initial', initial});

export const loadingOf = <L, I = never, E = never, D = never>(loading: L): ILE<I, L, E> => ({type: 'Loading', loading});

export const errorOf = <E, I = never, L = never, D = never>(error: E): ILE<I, L, E> => ({type: 'Error', error});

interface Endomorphism<I, L, E> {
    initial: (v: I) => I,
    loading: (v: L) => L,
    error: (v: E) => E,
}

type InferI<T> = T extends ILE<infer I, unknown, unknown>
    ? I
    : never;

type InferL<T> = T extends ILE<unknown, infer L, unknown>
    ? L
    : never;

type InferE<T> = T extends ILE<unknown, unknown, infer E>
    ? E
    : never;

export const endomorphism = <T, I = InferI<T>, L = InferL<T>, E = InferE<T>>(iledValue: ILE<I, L, E>, morphisms: Endomorphism<I, L, E>): ILE<I, L, E> => {
    if (iledValue.type === 'Initial') {
        return initialOf(morphisms['initial'](iledValue.initial));
    }

    if (iledValue.type === 'Loading') {
        return loadingOf(morphisms['loading'](iledValue.loading));
    }

    return errorOf(morphisms['error'](iledValue.error));
};

export const initialEndomorphism = <T, I = InferI<T>, L = InferL<T>, E = InferE<T>>(iledValue: ILE<I, L, E>, morphism: Endomorphism<I, L, E>['initial']): ILE<I, L, E> => {
    if (iledValue.type === 'Initial') {
        return initialOf(morphism(iledValue.initial));
    }

    return iledValue;
};

export const loadingEndomorphism = <T, I = InferI<T>, L = InferL<T>, E = InferE<T>>(iledValue: ILE<I, L, E>, morphism: Endomorphism<I, L, E>['loading']): ILE<I, L, E> => {
    if (iledValue.type === 'Loading') {
        return loadingOf(morphism(iledValue.loading));
    }

    return iledValue;
};

export const errorEndomorphism = <T, I = InferI<T>, L = InferL<T>, E = InferE<T>>(iledValue: ILE<I, L, E>, morphism: Endomorphism<I, L, E>['error']): ILE<I, L, E> => {
    if (iledValue.type === 'Error') {
        return errorOf(morphism(iledValue.error));
    }

    return iledValue;
};