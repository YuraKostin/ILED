import {FoldToRenderable, ILED} from "../../types/";

interface Props<I, L, E, D> {
    state: ILED<I, L, E, D>;
    onInitial: FoldToRenderable<I> | null;
    onLoading: FoldToRenderable<L> | null;
    onError: FoldToRenderable<E> | null;
    onData: FoldToRenderable<D> | null;
}

export const FoldILED = <I, L, E, D>(props: Props<I, L, E, D>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.data) : null;
        case "Loading":
            return props.onLoading ? props.onLoading(props.state.data) : null;
        case "Error":
            return props.onError ? props.onError(props.state.data) : null;
        case "Data":
            return props.onData ? props.onData(props.state.data) : null;
        default: {
            return type;
        }
    }
};
