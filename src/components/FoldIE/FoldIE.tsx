import {FoldToRenderable, IE} from "../../types/";

interface Props<I, E> {
    state: IE<I, E>;
    onInitial: FoldToRenderable<I> | null;
    onError: FoldToRenderable<E> | null;
}

export const FoldIE = <I, E>(props: Props<I, E>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.data) : null;
        case "Error":
            return props.onError ? props.onError(props.state.data) : null;
        default: {
            return type;
        }
    }
};
