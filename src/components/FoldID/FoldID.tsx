import {FoldToRenderable, ID} from "../../types/";

interface Props<I, D> {
    state: ID<I, D>;
    onInitial: FoldToRenderable<I> | null;
    onData: FoldToRenderable<D> | null;
}

export const FoldID = <I, D>(props: Props<I, D>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.data) : null;
        case "Data":
            return props.onData ? props.onData(props.state.data) : null;
        default: {
            return type;
        }
    }
};
