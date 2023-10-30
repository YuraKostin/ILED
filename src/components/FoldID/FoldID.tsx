import {FoldToRenderable, ID} from "../../types/";

type DetailedIDFolding<I, D> = {
    state: ID<I, D>;
    onInitial: FoldToRenderable<I> | null;
    onData: FoldToRenderable<D> | null;
};

type IDFoldingProps<I, D> = {
    state: ID<I, D>;
    viewForAllStates: FoldToRenderable<ID<I, D>>
};

export const DetailedIDFolding = <I, D>(props: DetailedIDFolding<I, D>) => {
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

export const IDFolding = <I, D>(props: IDFoldingProps<I, D>) =>
    props.viewForAllStates(props.state);
