import {FoldToRenderable, IL, PickDataType} from "../types";

export const initialOf = <I, L = never, E = never, D = never>(initial: I): IL<I, L> => ({type: 'Initial', initial});

export const loadingOf = <L, I = never, E = never, D = never>(loading: L): IL<I, L> => ({type: 'Loading', loading});

type DetailedFolding<I, L> = {
    state: IL<I, L>;
    onInitial: FoldToRenderable<I> | null;
    onLoading: FoldToRenderable<L> | null;
};

export const DetailedFolding = <I, L>(props: DetailedFolding<I, L>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.initial) : null;
        case "Loading":
            return props.onLoading ? props.onLoading(props.state.loading) : null;
        default: {
            return type;
        }
    }
};

export const foldValue = <I1, L1, I2, L2>(
    il: IL<I1, L1>,
    onInitial: (v: PickDataType<typeof il, 'Initial'>) => I2,
    onLoading: (v: PickDataType<typeof il, 'Loading'>) => L2,
) => {
    switch (il.type) {
        case "Initial":
            return onInitial(il.initial);
        case "Loading":
            return onLoading(il.loading);
    }
};

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