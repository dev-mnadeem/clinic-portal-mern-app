import {useCallback, useEffect, useState} from 'react';

// Loads a value once on mount and exposes reload() for after a mutation.
export default function useResource(load, initial) {
  const [state, setState] = useState({data:initial, loading:true, error:''});
  const reload = useCallback(async () => {
    setState(previous => ({...previous, loading:true}));
    try {
      setState({data:await load(), loading:false, error:''});
    } catch {
      setState(previous => ({...previous, loading:false, error:'Could not load this list. Check your connection and try again.'}));
    }
  }, [load]);
  useEffect(() => {void reload();}, [reload]);
  return {...state, reload};
}
