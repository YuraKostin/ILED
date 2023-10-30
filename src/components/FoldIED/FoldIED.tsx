import {FoldToRenderable, IED} from "../../types/";


type DetailedIEDFolding<I, E, D> = {
    state: IED<I, E, D>;
    onInitial: FoldToRenderable<I> | null;
    onError: FoldToRenderable<E> | null;
    onData: FoldToRenderable<D> | null;
};

type IEDFoldingProps<I, E, D> = {
    state: IED<I, E, D>;
    viewForAllStates: FoldToRenderable<IED<I, E, D>>
};

export const DetailedIEDFolding = <I, E, D>(props: DetailedIEDFolding<I, E, D>) => {
    const { type } = props.state;

    switch (type) {
        case "Initial":
            return props.onInitial ? props.onInitial(props.state.initial) : null;
        case "Error":
            return props.onError ? props.onError(props.state.error) : null;
        case "Data":
            return props.onData ? props.onData(props.state.data) : null;
        default: {
            return type;
        }
    }
};

export const IEDFolding = <I, E, D>(props: IEDFoldingProps<I, E, D>) =>
    props.viewForAllStates(props.state);
