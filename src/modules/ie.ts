import {FoldToRenderable, IE, PickDataType} from "../types";

export const initialOf = <I, E = never>(initial: I): IE<I, E> => ({type: 'Initial', initial});

export const errorOf = <E, I = never>(error: E): IE<I, E> => ({type: 'Error', error});

type DetailedFolding<I, E> = {
    state: IE<I, E>;
    onInitial: FoldToRenderable<I> | null;
    onError: FoldToRenderable<E> | null;
};

export const DetailedFolding = <I, E>(props: DetailedFolding<I, E>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.initial) : null;
        case "Error":
            return props.onError ? props.onError(props.state.error) : null;
        default: {
            return type;
        }
    }
};

export const foldValue = <I1, E1, I2, E2>(
    ie: IE<I1,E1>,
    onInitial: (v: PickDataType<typeof ie, 'Initial'>) => I2,
    onError: (v: PickDataType<typeof ie, 'Error'>) => E2,
) => {
    switch (ie.type) {
        case "Initial":
            return onInitial(ie.initial);
        case "Error":
            return onError(ie.error);
    }
};

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