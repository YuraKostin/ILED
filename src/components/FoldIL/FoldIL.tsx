import {FoldToRenderable, IL} from "../../types/";

type DetailedILFolding<I, L> = {
    state: IL<I, L>;
    onInitial: FoldToRenderable<I> | null;
    onLoading: FoldToRenderable<L> | null;
};

type ILFoldingProps<I, L> = {
    state: IL<I, L>;
    viewForAllStates: FoldToRenderable<IL<I, L>>
};

export const DetailedILFolding = <I, L>(props: DetailedILFolding<I, L>) => {
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

export const ILFolding = <I, L>(props: ILFoldingProps<I, L>) =>
    props.viewForAllStates(props.state);
