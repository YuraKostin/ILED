import {FoldToRenderable, ILED} from "../../types/";

type DetailedILEDFolding<I, L, E, D> = {
    state: ILED<I, L, E, D>;
    onInitial: FoldToRenderable<I> | null;
    onLoading: FoldToRenderable<L> | null;
    onError: FoldToRenderable<E> | null;
    onData: FoldToRenderable<D> | null;
};

type ILEDFoldingProps<I, L, E, D> = {
    state: ILED<I, L, E, D>;
    viewForAllStates: FoldToRenderable<ILED<I, L, E, D>>
};

export const DetailedILEDFolding = <I, L, E, D>(props: DetailedILEDFolding<I, L, E, D>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.initial) : null;
        case "Loading":
            return props.onLoading ? props.onLoading(props.state.loading) : null;
        case "Error":
            return props.onError ? props.onError(props.state.error) : null;
        case "Data":
            return props.onData ? props.onData(props.state.data) : null;
        default: {
            return type;
        }
    }
};

export const ILEDFolding = <I, L, E, D>(props: ILEDFoldingProps<I, L, E, D>) =>
    props.viewForAllStates(props.state);
