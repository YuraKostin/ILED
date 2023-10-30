import {ILD} from "../types";

export const initialOf = <I, L = never, E = never, D = never>(initial: I): ILD<I, L, D> => ({type: 'Initial', initial});

export const loadingOf = <L, I = never, E = never, D = never>(loading: L): ILD<I, L, D> => ({type: 'Loading', loading});

export const dataOf = <D, I = never, L = never, E = never>(data: D): ILD<I, L, D> => ({type: 'Data', data});

interface Endomorphism<I, L, D> {
    initial: (v: I) => I,
    loading: (v: L) => L,
    data: (v: D) => D,
}

type InferI<T> = T extends ILD<infer I, unknown, unknown>
    ? I
    : never;

type InferL<T> = T extends ILD<unknown, infer L, unknown>
    ? L
    : never;

type InferD<T> = T extends ILD<unknown, unknown, infer D>
    ? D
    : never;

export const endomorphism = <T, I = InferI<T>, L = InferL<T>, D = InferD<T>>(iledValue: ILD<I, L, D>, morphisms: Endomorphism<I, L, D>): ILD<I, L, D> => {
    if (iledValue.type === 'Initial') {
        return initialOf(morphisms['initial'](iledValue.initial));
    }

    if (iledValue.type === 'Loading') {
        return loadingOf(morphisms['loading'](iledValue.loading));
    }

    return dataOf(morphisms['data'](iledValue.data));
};

export const initialEndomorphism = <T, I = InferI<T>, L = InferL<T>, D = InferD<T>>(iledValue: ILD<I, L, D>, morphism: Endomorphism<I, L, D>['initial']): ILD<I, L, D> => {
    if (iledValue.type === 'Initial') {
        return initialOf(morphism(iledValue.initial));
    }

    return iledValue;
};

export const loadingEndomorphism = <T, I = InferI<T>, L = InferL<T>, D = InferD<T>>(iledValue: ILD<I, L, D>, morphism: Endomorphism<I, L, D>['loading']): ILD<I, L, D> => {
    if (iledValue.type === 'Loading') {
        return loadingOf(morphism(iledValue.loading));
    }

    return iledValue;
};

export const dataEndomorphism = <T, I = InferI<T>, L = InferL<T>, D = InferD<T>>(iledValue: ILD<I, L, D>, morphism: Endomorphism<I, L, D>['data']): ILD<I, L, D> => {
    if (iledValue.type === 'Data') {
        return dataOf(morphism(iledValue.data));
    }

    return iledValue;
};