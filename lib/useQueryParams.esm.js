import { useMemo } from 'react';
import qs from 'query-string';
import 'react-router';
import { useRouter } from './useRouter.esm.js';

function useQueryParams() {
  const { location, history } = useRouter();

  const queryParams = useMemo(() => qs.parse(location.search), [location.search]);

  const setQueryParams = newQueryParams => {
    const currentQueryParams = qs.parse(location.search);
    const url = `${location.pathname}?${qs.stringify({
      ...currentQueryParams,
      ...newQueryParams
    })}`;
    history.push(url);
  };

  return [queryParams, setQueryParams]
}

export { useQueryParams };
