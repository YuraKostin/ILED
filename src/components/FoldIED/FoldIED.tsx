import {FoldToRenderable, IED} from "../../types/";

interface Props<I, E, D> {
    state: IED<I, E, D>;
    onInitial: FoldToRenderable<I> | null;
    onError: FoldToRenderable<E> | null;
    onData: FoldToRenderable<D> | null;
}

export const FoldIED = <I, E, D>(props: Props<I, E, D>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.data) : null;
        case "Error":
            return props.onError ? props.onError(props.state.data) : null;
        case "Data":
            return props.onData ? props.onData(props.state.data) : null;
        default: {
            return type;
        }
    }
};
