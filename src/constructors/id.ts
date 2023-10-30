import {ID} from "../types";

export const initialOf = <I, D = never>(initial: I): ID<I, D> => ({type: 'Initial', initial});

export const dataOf = <D, I = never>(data: D): ID<I, D> => ({type: 'Data', data});

interface Endomorphism<I, D> {
    initial: (v: I) => I,
    data: (v: D) => D
}

type InferI<T> = T extends ID<infer I, unknown>
    ? I
    : never;

type InferD<T> = T extends ID<unknown, infer D>
    ? D
    : never;

export const endomorphism = <T, I = InferI<T>, D = InferD<T>>(iledValue: ID<I, D>, morphisms: Endomorphism<I, D>): ID<I, D> => {
    if (iledValue.type === 'Initial') {
        return initialOf(morphisms['initial'](iledValue.initial));
    }

    return dataOf(morphisms['data'](iledValue.data));
};

export const initialEndomorphism = <T, I = InferI<T>, D = InferD<T>>(iledValue: ID<I, D>, morphism: Endomorphism<I, D>['initial']): ID<I, D> => {
    if (iledValue.type === 'Initial') {
        return initialOf(morphism(iledValue.initial));
    }

    return iledValue;
};

export const dataEndomorphism = <T, I = InferI<T>, D = InferD<T>>(iledValue: ID<I, D>, morphism: Endomorphism<I, D>['data']): ID<I, D> => {
    if (iledValue.type === 'Data') {
        return dataOf(morphism(iledValue.data));
    }

    return iledValue;
};