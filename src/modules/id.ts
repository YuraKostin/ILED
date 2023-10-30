import {FoldToRenderable, ID, PickDataType} from "../types";

export const initialOf = <I, D = never>(initial: I): ID<I, D> => ({type: 'Initial', initial});

export const dataOf = <D, I = never>(data: D): ID<I, D> => ({type: 'Data', data});

type DetailedFolding<I, D> = {
    state: ID<I, D>;
    onInitial: FoldToRenderable<I> | null;
    onData: FoldToRenderable<D> | null;
};

export const DetailedFolding = <I, D>(props: DetailedFolding<I, D>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.initial) : null;
        case "Data":
            return props.onData ? props.onData(props.state.data) : null;
        default: {
            return type;
        }
    }
};

export const foldValue = <I1, D1, I2, D2>(
    id: ID<I1, D1>,
    onInitial: (v: PickDataType<typeof id, 'Initial'>) => I2,
    onData: (v: PickDataType<typeof id, 'Data'>) => D2,
) => {
    switch (id.type) {
        case "Initial":
            return onInitial(id.initial);
        case "Data":
            return onData(id.data);
    }
};

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