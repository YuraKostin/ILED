import {IE} from "../types";

export const initialOf = <I, L = never, E = never, D = never>(initial: I): IE<I, E> => ({type: 'Initial', initial});

export const errorOf = <E, I = never, L = never, D = never>(error: E): IE<I, E> => ({type: 'Error', error});

interface Endomorphism<I, E> {
    initial: (v: I) => I,
    error: (v: E) => E,
}

type InferI<T> = T extends IE<infer I, unknown>
    ? I
    : never;

type InferE<T> = T extends IE<unknown, infer E>
    ? E
    : never;

export const endomorphism = <T, I = InferI<T>, E = InferE<T>>(iledValue: IE<I, E>, morphisms: Endomorphism<I, E>): IE<I, E> => {
    if (iledValue.type === 'Initial') {
        return initialOf(morphisms['initial'](iledValue.initial));
    }

    return errorOf(morphisms['error'](iledValue.error));
};

export const initialEndomorphism = <T, I = InferI<T>, E = InferE<T>>(iledValue: IE<I, E>, morphism: Endomorphism<I, E>['initial']): IE<I, E> => {
    if (iledValue.type === 'Initial') {
        return initialOf(morphism(iledValue.initial));
    }

    return iledValue;
};

export const errorEndomorphism = <T, I = InferI<T>, E = InferE<T>>(iledValue: IE<I, E>, morphism: Endomorphism<I, E>['error']): IE<I, E> => {
    if (iledValue.type === 'Error') {
        return errorOf(morphism(iledValue.error));
    }

    return iledValue;
};