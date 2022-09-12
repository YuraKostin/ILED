import {FoldToRenderable, ILD } from "../../types/";

interface Props<I, L, D> {
    state: ILD<I, L, D>;
    onInitial: FoldToRenderable<I> | null;
    onLoading: FoldToRenderable<L> | null;
    onData: FoldToRenderable<D> | null;
}

export const FoldILD = <I, L, D>(props: Props<I, L, D>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.data) : null;
        case "Loading":
            return props.onLoading ? props.onLoading(props.state.data) : null;
        case "Data":
            return props.onData ? props.onData(props.state.data) : null;
        default: {
            return type;
        }
    }
};
