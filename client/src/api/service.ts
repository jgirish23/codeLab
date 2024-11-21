import {
    useQuery,
  } from '@tanstack/react-query'
  
export const useTest = () => useQuery({
    queryKey: ['dasd'],
    queryFn: () =>
      fetch('http://localhost:8080/codeLab/sda').then((res) =>
        res.json(),
      ),
  })