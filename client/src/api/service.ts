import {
    useQuery,
  } from '@tanstack/react-query'
  
export const useTest = () => useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('http://localhost:8080').then((res) =>
        res.json(),
      ),
  })