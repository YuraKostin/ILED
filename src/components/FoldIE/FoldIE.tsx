import {FoldToRenderable, IE} from "../../types/";


type DetailedIEFolding<I, E> = {
    state: IE<I, E>;
    onInitial: FoldToRenderable<I> | null;
    onError: FoldToRenderable<E> | null;
};

type IEFoldingProps<I, E> = {
    state: IE<I, E>;
    viewForAllStates: FoldToRenderable<IE<I, E>>
};

export const DetailedIEFolding = <I, E>(props: DetailedIEFolding<I, E>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.initial) : null;
        case "Error":
            return props.onError ? props.onError(props.state.error) : null;
        default: {
            return type;
        }
    }
};

export const IEFolding = <I, E>(props: IEFoldingProps<I, E>) =>
    props.viewForAllStates(props.state);
