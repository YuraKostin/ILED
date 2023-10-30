import {FoldToRenderable, ILE} from "../../types/";

type DetailedILEFolding<I, L, E> = {
    state: ILE<I, L, E>;
    onInitial: FoldToRenderable<I> | null;
    onLoading: FoldToRenderable<L> | null;
    onError: FoldToRenderable<E> | null;
};

type ILEFoldingProps<I, L, E> = {
    state: ILE<I, L, E>;
    viewForAllStates: FoldToRenderable<ILE<I, L, E>>
};

export const DetailedILEFolding = <I, L, E>(props: DetailedILEFolding<I, L, E>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.initial) : null;
        case "Loading":
            return props.onLoading ? props.onLoading(props.state.loading) : null;
        case "Error":
            return props.onError ? props.onError(props.state.error) : null;
        default: {
            return type;
        }
    }
};

export const ILEFolding = <I, L, E>(props: ILEFoldingProps<I, L, E>) =>
    props.viewForAllStates(props.state);

