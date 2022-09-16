import {Initial, Loading, Error, Data} from "../types";

export const initialOf = <T>(data: T): Initial<T> => ({type: 'Initial', data});
export const loadingOf = <T>(data: T): Loading<T> => ({type: 'Loading', data});
export const errorOf = <T>(data: T): Error<T> => ({type: 'Error', data});
export const dataOf = <T>(data: T): Data<T> => ({type: 'Data', data});
