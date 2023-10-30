import {FoldToRenderable, IED, PickDataType} from "../types";

export const initialOf = <I, E = never, D = never>(initial: I): IED<I, E, D> => ({type: 'Initial', initial});

export const errorOf = <E, I = never, D = never>(error: E): IED<I, E, D> => ({type: 'Error', error});

export const dataOf = <D, I = never, E = never>(data: D): IED<I, E, D> => ({type: 'Data', data});

type DetailedFolding<I, E, D> = {
    state: IED<I, E, D>;
    onInitial: FoldToRenderable<I> | null;
    onError: FoldToRenderable<E> | null;
    onData: FoldToRenderable<D> | null;
};

export const DetailedFolding = <I, E, D>(props: DetailedFolding<I, E, D>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.initial) : null;
        case "Error":
            return props.onError ? props.onError(props.state.error) : null;
        case "Data":
            return props.onData ? props.onData(props.state.data) : null;
        default: {
            return type;
        }
    }
};

export const foldValue = <I1, E1, D1, I2, E2, D2>(
    ied: IED<I1, E1, D1>,
    onInitial: (v: PickDataType<typeof ied, 'Initial'>) => I2,
    onError: (v: PickDataType<typeof ied, 'Error'>) => E2,
    onData: (v: PickDataType<typeof ied, 'Data'>) => D2,
) => {
    switch (ied.type) {
        case "Initial":
            return onInitial(ied.initial);
        case "Error":
            return onError(ied.error);
        case "Data":
            return onData(ied.data);
    }
};

interface Endomorphism<I, E, D> {
    initial: (v: I) => I,
    error: (v: E) => E,
    data: (v: D) => D,
}

type InferI<T> = T extends IED<infer I, unknown, unknown>
    ? I
    : never;

type InferE<T> = T extends IED<unknown, infer E, unknown>
    ? E
    : never;

type InferD<T> = T extends IED<unknown, unknown, infer D>
    ? D
    : never;

export const endomorphism = <T, I = InferI<T>, E = InferE<T>, D = InferD<T>>(iledValue: IED<I, E, D>, morphisms: Endomorphism<I, E, D>): IED<I, E, D> => {
    if (iledValue.type === 'Initial') {
        return initialOf(morphisms['initial'](iledValue.initial));
    }

    if (iledValue.type === 'Error') {
        return errorOf(morphisms['error'](iledValue.error));
    }

    return dataOf(morphisms['data'](iledValue.data));
};

export const initialEndomorphism = <T, I = InferI<T>, E = InferE<T>, D = InferD<T>>(iledValue: IED<I, E, D>, morphism: Endomorphism<I, E, D>['initial']): IED<I, E, D> => {
    if (iledValue.type === 'Initial') {
        return initialOf(morphism(iledValue.initial));
    }

    return iledValue;
};

export const errorEndomorphism = <T, I = InferI<T>, E = InferE<T>, D = InferD<T>>(iledValue: IED<I, E, D>, morphism: Endomorphism<I, E, D>['error']): IED<I, E, D> => {
    if (iledValue.type === 'Error') {
        return errorOf(morphism(iledValue.error));
    }

    return iledValue;
};

export const dataEndomorphism = <T, I = InferI<T>, E = InferE<T>, D = InferD<T>>(iledValue: IED<I, E, D>, morphism: Endomorphism<I, E, D>['data']): IED<I, E, D> => {
    if (iledValue.type === 'Data') {
        return dataOf(morphism(iledValue.data));
    }

    return iledValue;
};