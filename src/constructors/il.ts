import {IL} from "../types";
export const initialOf = <I, L = never, E = never, D = never>(initial: I): IL<I, L> => ({type: 'Initial', initial});
export const loadingOf = <L, I = never, E = never, D = never>(loading: L): IL<I, L> => ({type: 'Loading', loading});

interface Endomorphism<I, L> {
    initial: (v: I) => I,
    loading: (v: L) => L
}

type InferI<T> = T extends IL<infer I, unknown>
    ? I
    : never;

type InferL<T> = T extends IL<unknown, infer L>
    ? L
    : never;

export const endomorphism = <T, I = InferI<T>, L = InferL<T>>(iledValue: IL<I, L>, morphisms: Endomorphism<I, L>): IL<I, L> => {
    if (iledValue.type === 'Initial') {
        return initialOf(morphisms['initial'](iledValue.initial));
    }

    return loadingOf(morphisms['loading'](iledValue.loading));
};

export const initialEndomorphism = <T, I = InferI<T>, L = InferL<T>>(iledValue: IL<I, L>, morphism: Endomorphism<I, L>['initial']): IL<I, L> => {
    if (iledValue.type === 'Initial') {
        return initialOf(morphism(iledValue.initial));
    }

    return iledValue;
};

export const loadingEndomorphism = <T, I = InferI<T>, L = InferL<T>>(iledValue: IL<I, L>, morphism: Endomorphism<I, L>['loading']): IL<I, L> => {
    if (iledValue.type === 'Loading') {
        return loadingOf(morphism(iledValue.loading));
    }

    return iledValue;
};