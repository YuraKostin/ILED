import {ILED, Initial, Loading, Error, Data} from "../types";

export const initialOf = <I, L = never, E = never, D = never>(initial: I): ILED<I, L, E, D> => ({type: 'Initial', initial});

export const loadingOf = <L, I = never, E = never, D = never>(loading: L): ILED<I, L, E, D> => ({type: 'Loading', loading});

export const errorOf = <E, I = never, L = never, D = never>(error: E): ILED<I, L, E, D> => ({type: 'Error', error});

export const dataOf = <D, I = never, L = never, E = never>(data: D): ILED<I, L, E, D> => ({type: 'Data', data});

interface Endomorphism<I, L, E, D> {
    initial: (v: I) => I,
    loading: (v: L) => L,
    error: (v: E) => E,
    data: (v: D) => D,
}

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

export const endomorphism = <T, I = InferI<T>, L = InferL<T>, E = InferE<T>, D = InferD<T>>(iledValue: ILED<I, L, E, D>, morphisms: Endomorphism<I, L, E, D>): ILED<I, L, E, D> => {
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

export const initialEndomorphism = <T, I = InferI<T>, L = InferL<T>, E = InferE<T>, D = InferD<T>>(iledValue: ILED<I, L, E, D>, morphism: Endomorphism<I, L, E, D>['initial']): ILED<I, L, E, D> => {
    if (iledValue.type === 'Initial') {
        return initialOf(morphism(iledValue.initial));
    }

    return iledValue;
};

export const loadingEndomorphism = <T, I = InferI<T>, L = InferL<T>, E = InferE<T>, D = InferD<T>>(iledValue: ILED<I, L, E, D>, morphism: Endomorphism<I, L, E, D>['loading']): ILED<I, L, E, D> => {
    if (iledValue.type === 'Loading') {
        return loadingOf(morphism(iledValue.loading));
    }

    return iledValue;
};

export const errorEndomorphism = <T, I = InferI<T>, L = InferL<T>, E = InferE<T>, D = InferD<T>>(iledValue: ILED<I, L, E, D>, morphism: Endomorphism<I, L, E, D>['error']): ILED<I, L, E, D> => {
    if (iledValue.type === 'Error') {
        return errorOf(morphism(iledValue.error));
    }

    return iledValue;
};

export const dataEndomorphism = <T, I = InferI<T>, L = InferL<T>, E = InferE<T>, D = InferD<T>>(iledValue: ILED<I, L, E, D>, morphism: Endomorphism<I, L, E, D>['data']): ILED<I, L, E, D> => {
    if (iledValue.type === 'Data') {
        return dataOf(morphism(iledValue.data));
    }

    return iledValue;
};