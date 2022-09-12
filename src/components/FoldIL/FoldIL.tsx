import {FoldToRenderable, IL } from "../../types/";

interface Props<I, L> {
    state: IL<I, L>;
    onInitial: FoldToRenderable<I> | null;
    onLoading: FoldToRenderable<L> | null;
}

export const FoldIL = <I, L>(props: Props<I, L>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.data) : null;
        case "Loading":
            return props.onLoading ? props.onLoading(props.state.data) : null;
        default: {
            return type;
        }
    }
};
