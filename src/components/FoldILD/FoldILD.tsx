import {FoldToRenderable, ILD} from "../../types/";

type DetailedILDFolding<I, L, D> = {
    state: ILD<I, L, D>;
    onInitial: FoldToRenderable<I> | null;
    onLoading: FoldToRenderable<L> | null;
    onData: FoldToRenderable<D> | null;
};

type ILDFoldingProps<I, L, D> = {
    state: ILD<I, L, D>;
    viewForAllStates: FoldToRenderable<ILD<I, L, D>>
};

export const DetailedILDFolding = <I, L, D>(props: DetailedILDFolding<I, L, D>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.initial) : null;
        case "Loading":
            return props.onLoading ? props.onLoading(props.state.loading) : null;
        case "Data":
            return props.onData ? props.onData(props.state.data) : null;
        default: {
            return type;
        }
    }
};

export const ILDFolding = <I, L, D>(props: ILDFoldingProps<I, L, D>) =>
    props.viewForAllStates(props.state);
