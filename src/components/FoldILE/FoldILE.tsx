import {FoldToRenderable, ILE } from "../../types/";

interface Props<I, L, E> {
    state: ILE<I, L, E>;
    onInitial: FoldToRenderable<I> | null;
    onLoading: FoldToRenderable<L> | null;
    onError: FoldToRenderable<E> | null;
}

export const FoldILE = <I, L, E>(props: Props<I, L, E>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.data) : null;
        case "Loading":
            return props.onLoading ? props.onLoading(props.state.data) : null;
        case "Error":
            return props.onError ? props.onError(props.state.data) : null;
        default: {
            return type;
        }
    }
};
